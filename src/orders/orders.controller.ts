import {
	Controller,
	Get,
	Req,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags, ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('orders')
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@Post()
	@ApiBearerAuth()
	@ApiTags('orders')
	create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
		return this.ordersService.create(createOrderDto, req['customerId']);
	}

	@Get()
	@ApiTags('admin')
	findAll() {
		return this.ordersService.findAll();
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiTags('orders')
	findOne(@Param('id') id: string) {
		return this.ordersService.findOne(+id);
	}

	@Patch(':id')
	@ApiTags('admin')
	update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
		return this.ordersService.update(+id, updateOrderDto);
	}
}
