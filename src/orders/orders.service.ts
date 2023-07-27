import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AmqpService } from 'src/rabbitmq/amqp.service';

@Injectable()
export class OrdersService {
	constructor(public prisma: PrismaService, private amqpService: AmqpService) {}

	async create(createOrderDto: CreateOrderDto, customerId: number) {
		let orderItems = createOrderDto.items;
		let total = 0;
		for (let i = 0; i < orderItems.length; i++) {
			const book = await this.prisma.book.findUnique({
				where: { id: orderItems[i].bookId },
			});
			total += book.price * orderItems[i].quantity;
		}
		const order = await this.prisma.order.create({
			data: {
				customer: {
					connect: { id: customerId },
				},
				total: total,
				orderItems: {
					create: orderItems,
				},
			},
		});

        this.amqpService.publishToOrderChannel(order.id.toString());

		return order;
	}

	async findAll() {
		const orders = await this.prisma.order.findMany({
			include: {
				customer: {
					select: {
						name: true,
						email: true,
						point: true,
					},
				},
				orderItems: {
					include: {
						book: {
							select: {
								title: true,
								writer: true,
								price: true,
								coverImage: true,
								tag: true,
							},
						},
					},
				},
			},
		});

		return orders.map((order) => ({
			id: order.id,
			customer: order.customer,
			orderItems: order.orderItems.map((orderItem) => ({
				book: orderItem.book,
				quantity: orderItem.quantity,
			})),
            status: order.status,
			total: order.total,
			createdAt: order.createdAt,
			updatedAt: order.updatedAt,
		}));
	}

	async findOne(id: number) {
		const order = await this.prisma.order.findUnique({
			where: { id: id },
			include: {
				customer: {
					select: {
						name: true,
						email: true,
						point: true,
					},
				},
				orderItems: {
					include: {
						book: {
							select: {
								title: true,
								writer: true,
								price: true,
								coverImage: true,
								tag: true,
							},
						},
					},
				},
			},
		});

		return {
			id: order.id,
			customer: order.customer,
			orderItems: order.orderItems.map((orderItem) => ({
				book: orderItem.book,
				quantity: orderItem.quantity,
			})),
            status: order.status,
			total: order.total,
			createdAt: order.createdAt,
			updatedAt: order.updatedAt,
		};
	}

	update(id: number, updateOrderDto: UpdateOrderDto) {
		return this.prisma.order.update({
			where: { id: id },
			data: {
				status: updateOrderDto.status,
			},
		});
	}
}
