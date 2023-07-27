import { Injectable, forwardRef, Inject } from '@nestjs/common';

import * as amqp from 'amqplib';
import * as fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';

// RabbitMQ connection options
const rabbitMQUrl = 'amqp://localhost'; // Replace with your RabbitMQ server URL
const exchangeName = 'book_store_exchange';
const queueName = 'logs_Queue';
const fileName = './logs/logs.txt';


// Create a RabbitMQ connection and channel
let connection: amqp.Connection | null = null;
let logschannel: amqp.Channel | null = null;
let orderChannel: amqp.Channel | null = null;

@Injectable()
export class AmqpService {
    constructor(
        private prisma: PrismaService) {}

    async connectToRabbitMQ() {
        try {
            connection = await amqp.connect(rabbitMQUrl);
            logschannel = await connection.createChannel();
            orderChannel = await connection.createChannel();
    
            // Assert an exchange and queue (make sure they exist)
            await logschannel.assertExchange(exchangeName, 'fanout', {
                durable: false,
            });
            await logschannel.assertQueue(queueName, { durable: false });
            await logschannel.bindQueue(queueName, exchangeName, '');
    
            await orderChannel.assertExchange('order_exchange', 'direct', {
                durable: false,
            });
    
            await orderChannel.assertQueue('order_queue', { durable: false });
            await orderChannel.bindQueue('order_queue', 'order_exchange', '');
    
            console.log('connecected to rabbitmq');
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
        }
    }

    async publishTologschannelmessage(message: string) {
        if (!logschannel) {
            console.error(
                'RabbitMQ channel not initialized. Make sure to call connectToRabbitMQ first.',
            );
            return;
        }
    
        try {
            await logschannel.publish(exchangeName, '', Buffer.from(message));
            console.log('Message published to RabbitMQ:', message);
        } catch (error) {
            console.error('Error publishing to RabbitMQ:', error);
        }
    }

    async consumeFromRabbitMQ() {
        if (!logschannel) {
            console.error(
                'RabbitMQ channel not initialized. Make sure to call connectToRabbitMQ first.',
            );
            return;
        }
        console.log('consumeFromRabbitMQ:::');
        try {
            // Set up the consumer
            await logschannel.consume(queueName, (msg) => {
                if (msg) {
                    const message = msg.content.toString();
                    console.log('Received message:', message);
                    this.writeLogsOnFile(message);
                    // Acknowledge the message to remove it from the queue
                    logschannel?.ack(msg);
                }
            });
        } catch (error) {
            console.error('Error consuming from RabbitMQ:', error);
        }
    
        if(!orderChannel) {
            console.error(
                'RabbitMQ channel not initialized. Make sure to call connectToRabbitMQ first.',
            );
            return;
        }
        console.log('consumeFromRabbitMQ:::');
        try {
            // Set up the consumer
            await orderChannel.consume('order_queue', async (msg: any) => {
                if (msg) {
                    const message = msg.content.toString();
                    console.log('Processing order no:', message); 
                    await this.prisma.order.update({
                        where: {
                            id: parseInt(message)
                        },
                        data: {
                            status: 'processing'
                        }
                    });
                    // Acknowledge the message to remove it from the queue
                    orderChannel?.ack(msg);
                }
            });
        }
        catch (error) {
            console.error('Error consuming from RabbitMQ:', error);
        }
    }

    async publishToOrderChannel(orderId: string) {
        if (!orderChannel) {
            console.error(
                'RabbitMQ channel not initialized. Make sure to call connectToRabbitMQ first.',
            );
            return;
        }
    
        try {
            await orderChannel.publish('order_exchange', '', Buffer.from(orderId));
            console.log('order published to order channel:', orderId);
        } catch (error) {
            console.error('Error publishing to RabbitMQ:', error);
        }
    }

    writeLogsOnFile(log: any) {
        fs.appendFileSync(fileName, log);
    }
}