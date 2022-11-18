import express from 'express';
import createError from 'http-errors';

import logger from '../utils/logger';
import initMiddleware from '../middleware/init';
import { getStatus } from '../controllers/index';
import authRouter from './auth';
import vaultRouter from './vault';

const router = express.Router();

router.use(initMiddleware);

router.get('/status', getStatus);
router.use('/auth', authRouter);
router.use('/vault', vaultRouter);

// catch 404 and forward to error handler
router.use(
	(
		_req: express.Request,
		_res: express.Response,
		next: express.NextFunction
	) => {
		next(createError(404, 'Page not found'));
	}
);

// error handler
router.use(
	(
		error: Error,
		_req: express.Request,
		res: express.Response,
		// eslint-disable-next-line no-unused-vars
		_next: express.NextFunction
	) => {
		if (error instanceof createError.HttpError) {
			const obj: { [key: string]: any } = {
				message: error.message
			};

			if (error.code !== undefined) {
				obj.code = error.code;
			}

			if (error.errors) {
				obj.errors = error.errors;
			}

			res.status(error.status).json(obj);
		} else {
			logger.error(error);
			res.status(500).json({ message: 'Server error.' });
		}
	}
);

export default router;
