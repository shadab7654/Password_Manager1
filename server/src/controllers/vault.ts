import createError from 'http-errors';
import { Vault } from '../models';
import { vaultValidator } from '../validators';
import createController from './createController';

// eslint-disable-next-line import/prefer-default-export
export const getVault = createController(
	async (req, res) => {
		if (!res.locals.decoded) {
			throw new Error('Decoded is not present in authenticated route.');
		}

		const { id } = res.locals.decoded;

		const vault = await Vault.findOne({ userId: id });

		if (!vault) {
			throw createError(404, 'Vault not found.');
		}

		res.json({ vault: vault.toJSON() });
	},
	{
		authenticated: true
	}
);

export const updateVault = createController(
	async (req, res) => {
		if (!(res.locals.body && res.locals.body.value && !res.locals.body.error)) {
			throw new Error('Invalid validated data');
		}

		if (!res.locals.decoded) {
			throw new Error('Decoded is not present in authenticated route.');
		}

		const { vault } = res.locals.body.value;
		const { id } = res.locals.decoded;

		await Vault.updateOne(
			{
				userId: id
			},
			{ $set: { vault } }
		);

		res.json({ message: 'Vault updated successfully' });
	},
	{
		validation: {
			body: {
				validator: vaultValidator
			}
		},
		authenticated: true
	}
);
