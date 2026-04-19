import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  async findAll(search?: string, category?: string) {
    const query = this.productRepo.createQueryBuilder('product')
      .where('product.isActive = :active', { active: true });

    if (search) {
      query.andWhere(
        '(LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search))',
        { search: `%${search}%` }
      );
    }

    if (category) {
      query.andWhere('product.category = :category', { category });
    }

    return query.orderBy('product.createdAt', 'DESC').getMany();
  }

  async findOne(id: string) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: Partial<CreateProductDto>) {
    await this.findOne(id);
    await this.productRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.productRepo.update(id, { isActive: false });
    return { message: 'Product deleted' };
  }
}
