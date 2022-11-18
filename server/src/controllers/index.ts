import { RequestHandler } from 'express';

export * from './auth';
export * from './vault';

export const getStatus: RequestHandler = (req, res) => {
	res.json({ message: 'Running' });
};
