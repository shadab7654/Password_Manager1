import createError from 'http-errors';
import { User, IUser, Vault } from '../models';
import { signupValidator, loginValidator } from '../validators';
import { hashPassword, checkPassword } from '../utils/hash';
import { signToken } from '../utils/jwt';
import createController from './createController';

// eslint-disable-next-line import/prefer-default-export
export const signupUser = createController(
	async (req, res) => {
		if (!(res.locals.body && res.locals.body.value && !res.locals.body.error)) {
			throw new Error('Invalid validated data');
		}

		const { name, email, masterKeyHash, protectedSymmetricKey } =
			res.locals.body.value;

		const password = await hashPassword(masterKeyHash);

		let user: IUser;
		try {
			user = await User.create({
				name,
				email,
				password,
				protectedSymmetricKey
			});
		} catch (error) {
			if (error.code === 11000) {
				throw createError(409, 'An account with this email already exists.');
			}

			throw error;
		}

    await Vault.create({ userId: user.id, vault: "" });

		const userData = user.toJSON();

		delete userData.password;
		delete userData.protectedSymmetricKey;

		const token = signToken({
			id: user.id,
			email: user.email
		});

		res.json({ message: 'Account created.', user: userData, token });
	},
	{
		validation: {
			body: {
				validator: signupValidator
			}
		}
	}
);

export const loginUser = createController(
	async (req, res) => {
		if (!(res.locals.body && res.locals.body.value && !res.locals.body.error)) {
			throw new Error('Invalid validated data');
		}

		const { email, masterKeyHash } = res.locals.body.value;

		const user = await User.findOne({
			email
		}).select('_id email password');

		if (!user) {
			throw createError(400, 'Invalid email or password.');
		}

		const isValidPassword = await checkPassword(
			masterKeyHash,
			user.password as string
		);

		if (!isValidPassword) {
			throw createError(400, 'Invalid email or password.');
		}

		const token = signToken({
			id: user.id,
			email: user.email
		});

		res.json({ message: 'Login success.', token });
	},
	{
		validation: {
			body: {
				validator: loginValidator
			}
		}
	}
);
