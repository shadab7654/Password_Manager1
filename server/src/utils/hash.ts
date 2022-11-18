import crypto from 'crypto';

const HASH_COUNT = 100000;

export const pbkdf2 = (
	str: string,
	salt: string,
	iterations: number,
	keylen: number
): Promise<string> =>
	new Promise((resolve, reject) => {
		crypto.pbkdf2(str, salt, iterations, keylen, 'sha256', (error, key) => {
			if (error) {
				reject(error);
				return;
			}

			resolve(key.toString('base64'));
		});
	});

/**
 * Password hash is in the format of:
 * SaltLen (4) + Salt (?) + HashCount (8) + Hash
 */
export const hashPassword = async (str: string) => {
	const salt = crypto.randomBytes(64).toString('base64');
	const pbkdf2Hash = await pbkdf2(str, salt, HASH_COUNT, 256);
	// 2 Bytes - 4 len
	const saltLenHex = salt.length.toString(16).padStart(4, '0');
	// 4 Bytes - 8 len
	const hashCountHex = HASH_COUNT.toString(16).padStart(8, '0');

	return saltLenHex + salt + hashCountHex + pbkdf2Hash;
};

export const checkPassword = async (password: string, hash: string) => {
	const saltLenHex = hash.slice(0, 4);
	const saltLen = parseInt(saltLenHex, 16);
	const salt = hash.slice(4, 4 + saltLen);

	const hashCountHex = hash.slice(4 + saltLen, 4 + saltLen + 8);
	const hashCount = parseInt(hashCountHex, 16);

	const pbkdf2Hash = await pbkdf2(password, salt, hashCount, 256);

	return pbkdf2Hash === hash.slice(4 + saltLen + 8);
};
