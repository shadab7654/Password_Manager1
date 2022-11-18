/**
 * This will export a helper function (createController) which will abstract
 * some functionalities of the controller.
 */

import Joi from 'joi';
import { ParsedQs } from 'qs';
import createError from 'http-errors';
import express from 'express';

import authMiddleware from '../middleware/auth';

const VALIDATION_ERROR = 'Validation error.';

export interface ValidationOptions {
	validator: Joi.ObjectSchema;
	errorMsg?: string;
	returnError?: boolean;
	validationOptions?: Joi.ValidationOptions;
}

export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;

export type ValidationBodies = 'body' | 'param' | 'query';

export interface ValidationResult {
	value?: any;
	error?: { [key: string]: string };
}

export interface ControllerOptions {
	validation?: PartialRecord<ValidationBodies, ValidationOptions>;
  authenticated?: boolean;
}

/**
 * It returns the validation errors.
 */
const extractValidationError = (
	error: Joi.ValidationError
): { [key: string]: string } => {
	const errorsMap: { [key: string]: string } = {};
	if (error.details) {
		// eslint-disable-next-line no-restricted-syntax
		for (const detail of error.details) {
			if (detail.context && detail.context.key) {
				errorsMap[detail.context.key] = detail.message;
			}
		}
	}
	return errorsMap;
};

/**
 * Create a middleware for validation check with the options specified
 */
const createValidationMiddleware =
	({
		body,
		validator,
		errorMsg,
		returnError,
		validationOptions
	}: {
		body: ValidationBodies;
		validator: Joi.Schema;
		errorMsg: string;
		returnError: boolean;
		validationOptions?: Joi.ValidationOptions;
	}): express.RequestHandler =>
	async (req, res, next) => {
		let options: Joi.ValidationOptions = { abortEarly: false };
		if (validationOptions) {
			options = validationOptions;
		}

		const { value, error } = validator.validate(req[body], options);

		if (error) {
			const extractedError = extractValidationError(error);
			if (!returnError) {
				next(createError(400, { errors: extractedError, code: 400 }, errorMsg));
				return;
			}
			res.locals[body] = { error: extractedError, value };
			next();
			return;
		}

		res.locals[body] = { value };
		next();
	};

/**
 * This will create a series of middleware functions to execute common tasks
 * based on the options provided.
 */
const createController = (
	controller: express.RequestHandler<
		Record<string, any>,
		any,
		any,
		ParsedQs,
		PartialRecord<ValidationBodies, undefined | ValidationResult> & {
			decoded?: { id: string; email: string };
		}
	>,
	options: ControllerOptions = {
		validation: undefined,
    authenticated: false
	}
) => {
	const middlewareArray: express.RequestHandler[] = [];

	const customController: express.RequestHandler = async (req, res, next) => {
		try {
			await controller(req, res, next);
		} catch (error) {
			next(error);
		}
	};

  if (options.authenticated) {
    middlewareArray.push(authMiddleware);
  }

	if (options.validation) {
		// eslint-disable-next-line no-restricted-syntax
		for (const key of ['body', 'query', 'param'] as Array<ValidationBodies>) {
			if (key in options.validation && options.validation[key] !== undefined) {
				const validation = options.validation[key] as ValidationOptions;
				middlewareArray.push(
					createValidationMiddleware({
						body: key,
						validator: validation.validator,
						returnError: validation.returnError || false,
						errorMsg: validation.errorMsg || VALIDATION_ERROR,
						validationOptions: validation.validationOptions
					})
				);
			}
		}
	}

	middlewareArray.push(customController);
	return middlewareArray;
};

export default createController;
