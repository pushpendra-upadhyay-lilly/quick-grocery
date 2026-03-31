import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  /**
   * Create order (Customer)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(user.id, dto);
  }

  /**
   * Get all orders (Customer)
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrders(@CurrentUser() user: any) {
    return this.ordersService.getOrders(user.id);
  }

  /**
   * Get order details (Customer)
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrder(@CurrentUser() user: any, @Param('id') orderId: string) {
    const order = await this.ordersService.getOrderById(orderId, user.id);
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return order;
  }

  /**
   * Get assigned orders (Delivery Partner)
   */
  @Get('assigned/list')
  @UseGuards(JwtAuthGuard)
  async getAssignedOrders(@CurrentUser() user: any) {
    console.log(user);
    return this.ordersService.getAssignedOrders(user.id);
  }

  /**
   * Get assigned order details (Delivery Partner)
   */
  @Get('assigned/:id')
  @UseGuards(JwtAuthGuard)
  async getAssignedOrder(
    @CurrentUser() user: any,
    @Param('id') orderId: string,
  ) {
    const order = await this.ordersService.getAssignedOrderById(orderId, user.id);
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return order;
  }

  /**
   * Update order status (Delivery Partner)
   * Allowed transitions: accepted -> going_for_pickup -> out_for_delivery -> reached
   */
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @CurrentUser() user: any,
    @Param('id') orderId: string,
    @Body() { status }: { status: OrderStatus },
  ) {
    if (!Object.values(OrderStatus).includes(status)) {
      throw new BadRequestException('Invalid status');
    }
    return this.ordersService.updateOrderStatus(orderId, user.id, status);
  }

  /**
   * Mark order as delivered (Delivery Partner confirms delivery)
   * Only available when status is 'reached'
   * Moves earnings from pending to confirmed
   */
  @Post(':id/delivered')
  @UseGuards(JwtAuthGuard)
  async markDelivered(
    @CurrentUser() user: any,
    @Param('id') orderId: string,
  ) {
    return this.ordersService.markDelivered(orderId, user.id);
  }
}
