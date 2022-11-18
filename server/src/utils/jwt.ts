import { sign, verify } from 'jsonwebtoken';

import config from '../config';

const secret: string = config.JWT.SECRET as string;
const expiresIn: string = config.JWT.EXPIRES_IN as string;

const signToken = (payload: any) => sign(payload, secret, { expiresIn });

const validateToken = (token: string) => {
	try {
		return verify(token.trim(), secret);
	} catch (e) {
		return false;
	}
};

export { signToken, validateToken };
