import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  
  @Post('payment-intent')
@ApiOperation({ summary: 'Create Stripe payment intent' })
createPaymentIntent(@Body('amount') amount: number) {
  return this.ordersService.createPaymentIntent(amount);
}
  

  @Post()
  @ApiOperation({ summary: 'Place a new order' })
  @ApiResponse({ status: 201, description: 'Order placed successfully' })
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(createOrderDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get my orders' })
  findMyOrders(@Request() req) {
    return this.ordersService.findMyOrders(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.ordersService.findOne(id, req.user.userId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (Admin)' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateStatus(id, status);
  }
}
