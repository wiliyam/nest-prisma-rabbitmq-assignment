import {
	Module,
	NestModule,
	MiddlewareConsumer,
	RequestMethod,
} from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { BooksModule } from './books/books.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { AuthMiddleWare } from './middleware/auth.middleware';
import { CustomersService } from './customers/customers.service';
import { AmqpService } from './rabbitmq/amqp.service';

@Module({
	imports: [PrismaModule, BooksModule, CustomersModule, OrdersModule],
	providers: [CustomersService]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleWare)
			.exclude(
				{ path: 'orders', method: RequestMethod.GET },
				{ path: 'orders', method: RequestMethod.PATCH },
			)
			.forRoutes('orders');
	}
}
