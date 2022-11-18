import Joi from 'joi';

export const vaultValidator = Joi.object({
	vault: Joi.string().required(),
});
