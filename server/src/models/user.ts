import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
	name: string;
	email: string;
	password?: string;
	protectedSymmetricKey?: string;
}

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		protectedSymmetricKey: {
			type: String,
			default: true
		}
	},
	{ timestamps: true }
);

export const User = mongoose.model<IUser>('user', UserSchema);
