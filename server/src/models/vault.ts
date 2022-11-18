import mongoose from 'mongoose';

export interface IVault extends mongoose.Document {
	userId: string;
	vault: string;
}

const VaultSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Types.ObjectId,
			required: true,
      unique: true
		},
		vault: {
			type: String,
			required: false,
		},
	},
	{ timestamps: true }
);

export const Vault = mongoose.model<IVault>('vault', VaultSchema);

