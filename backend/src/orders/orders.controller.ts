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
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // ── Customer endpoints ────────────────────────────────────────────────────

  @Post()
  @Roles('user')
  async createOrder(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(user.id, dto);
  }

  @Get()
  @Roles('user')
  async getOrders(@CurrentUser() user: any) {
    return this.ordersService.getOrders(user.id);
  }

  @Get(':id')
  @Roles('user')
  async getOrder(@CurrentUser() user: any, @Param('id') orderId: string) {
    const order = await this.ordersService.getOrderById(orderId, user.id);
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return order;
  }

  // ── Delivery partner endpoints ────────────────────────────────────────────

  @Get('assigned/list')
  @Roles('delivery_partner')
  async getAssignedOrders(@CurrentUser() user: any) {
    return this.ordersService.getAssignedOrders(user.id);
  }

  @Get('assigned/:id')
  @Roles('delivery_partner')
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

  @Patch(':id/status')
  @Roles('delivery_partner')
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

  @Post(':id/delivered')
  @Roles('delivery_partner')
  async markDelivered(@CurrentUser() user: any, @Param('id') orderId: string) {
    return this.ordersService.markDelivered(orderId, user.id);
  }
}
