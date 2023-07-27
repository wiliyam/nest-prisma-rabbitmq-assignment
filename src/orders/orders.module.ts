import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AmqpModule } from 'src/rabbitmq/amqp.module';
import { AmqpService } from 'src/rabbitmq/amqp.service';

@Module({
	controllers: [OrdersController],
	providers: [OrdersService],
	imports: [PrismaModule, AmqpModule],
    exports: [OrdersService]
})
export class OrdersModule {}
