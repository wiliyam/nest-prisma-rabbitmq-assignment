import { Module } from '@nestjs/common';
import { AmqpService } from './amqp.service';
import { OrdersModule } from 'src/orders/orders.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    providers: [AmqpService],
    imports: [PrismaModule],
    exports: [AmqpService]
})

export class AmqpModule {}