import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import  * as morgan from 'morgan';
import { AmqpService } from './rabbitmq/amqp.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
    const amqpService = app.get(AmqpService);

	const config = new DocumentBuilder()
		.setTitle('Bookstore API')
		.setDescription('The bookstore API description')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

    await amqpService.connectToRabbitMQ();
	await amqpService.consumeFromRabbitMQ();
    app.use(morgan('combined',{
        stream: {
            write: (message : string) => {
                amqpService.publishTologschannelmessage(message)
            }
        }
    }));

	await app.listen(3000);
}
bootstrap();
