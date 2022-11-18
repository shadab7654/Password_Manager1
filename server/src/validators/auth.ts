import Joi from 'joi';

export const signupValidator = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	masterKeyHash: Joi.string().required(),
	protectedSymmetricKey: Joi.string().required()
});

export const loginValidator = Joi.object({
	email: Joi.string().email().required(),
	masterKeyHash: Joi.string().required()
});
