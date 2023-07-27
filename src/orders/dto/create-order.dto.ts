import { ApiProperty } from '@nestjs/swagger';

class OrderItem {
	@ApiProperty()
	bookId: number;
	@ApiProperty()
	quantity: number;
}

export class CreateOrderDto {
	@ApiProperty({example: [
        {
            bookId: 1,
            quantity: 2
        }
    ]})
	items: OrderItem[];
}
