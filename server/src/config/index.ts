/**
 * This file will contain all the configuration keys.
 * Throws error if in production and a key is not specified.
 */

const getEnvVariable = (key: string, isRequired = true): string | undefined => {
	const value = process.env[key];

	if (!value && isRequired) {
		throw new Error(`ENVIREMENT VARIABLE '${key}' NOT SPECIFIED.`);
	}

	return value;
};

const config = {
	DB: {
		URI: getEnvVariable('DB_URI')
	},
	JWT: {
		SECRET: getEnvVariable('JWT_SECRET'),
		EXPIRES_IN: getEnvVariable('JWT_EXPIRES_IN')
	}
};

export default config;
