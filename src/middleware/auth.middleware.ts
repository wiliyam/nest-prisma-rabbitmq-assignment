import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { CustomersService } from '../customers/customers.service';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
	constructor(private readonly customersService: CustomersService) {}
	async use(req: Request, res: Response, next: NextFunction) {
		let token = req.headers['authorization'];
		if (!token) {
			res.status(401).send({ message: 'Unauthorized' });
			return;
		}
		if (token.startsWith('Bearer ')) {
			token = token.slice(7, token.length).trim();
		}

		const isValid = await this.customersService.verify(token);
		if (isValid == false) {
			res.status(401).send({ message: 'Unauthorized' });
			return;
		}
		req['customerId'] = isValid;
		next();
	}
}
