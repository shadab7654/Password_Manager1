import { RequestHandler } from 'express';
import { validateToken } from '../utils/jwt';

const auth: RequestHandler = (req, res, next) => {
	try {
		let authToken = req.header('authorization') || '';
		authToken = authToken.replace('Bearer ', '');
		const decoded = validateToken(authToken);
		if (!decoded) {
			throw new Error('Error in decoding JWT');
		}

		res.locals.decoded = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: 'Unauthorized.' });
	}
};

export default auth;
