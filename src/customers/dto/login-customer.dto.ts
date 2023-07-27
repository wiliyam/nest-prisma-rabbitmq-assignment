import { ApiProperty } from '@nestjs/swagger';

export class LoginCustomerDta {
	@ApiProperty({ required: true })
	email: string;

	@ApiProperty({ required: true })
	password: string;
}
