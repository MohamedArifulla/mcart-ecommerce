import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import Stripe from 'stripe';

@Injectable()
export class OrdersService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2026-02-25.clover',
    });
  }

  async createPaymentIntent(amount: number) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // paise to cents
      currency: 'inr',
    });
    return { clientSecret: paymentIntent.client_secret };
  }

  async create(createOrderDto: CreateOrderDto, userId: string) {
    let totalAmount = 0;
    const orderItems: {
      productId: string;
      productName: string;
      price: number;
      quantity: number;
    }[] = [];

    for (const item of createOrderDto.items) {
      const product = await this.productsRepository.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        );
      }

      totalAmount += Number(product.price) * item.quantity;
      orderItems.push({
        productId: item.productId,
        productName: product.name,
        price: Number(product.price),
        quantity: item.quantity,
      });
    }

    for (const item of createOrderDto.items) {
      await this.productsRepository.decrement(
        { id: item.productId },
        'stock',
        item.quantity,
      );
    }

    const order = this.ordersRepository.create({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress: createOrderDto.shippingAddress,
      paymentMethod: createOrderDto.paymentMethod || 'COD',
      paymentStatus: createOrderDto.paymentMethod === 'STRIPE' ? 'PAID' : 'PENDING',
    });

    return this.ordersRepository.save(order);
  }

  async findMyOrders(userId: string) {
    return this.ordersRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    const order = await this.ordersRepository.findOne({
      where: { id, userId },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: string) {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    order.status = status as any;
    return this.ordersRepository.save(order);
  }

  async findAll() {
    return this.ordersRepository.find({ order: { createdAt: 'DESC' } });
  }
}
