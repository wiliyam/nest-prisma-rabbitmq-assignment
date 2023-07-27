import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { LoginCustomerDta } from './dto/login-customer.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('customers')
@ApiTags('customers')
export class CustomersController {
	constructor(private readonly customersService: CustomersService) {}

	@Post('register')
	register(@Body() createCustomerDto: CreateCustomerDto) {
		return this.customersService.register(createCustomerDto);
	}

	@Post('login')
	login(@Body() loginCustomerDto: LoginCustomerDta) {
		return this.customersService.login(loginCustomerDto);
	}
}
