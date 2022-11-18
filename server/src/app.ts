/* eslint-disable import/first */
import express from 'express';
import dotenv from 'dotenv-flow';

dotenv.config();

import logger from './utils/logger';
import databaseConnect from './database';
import apiRouter from './server';

const PORT = process.env.PORT || 3000;

async function run() {
	try {
		await databaseConnect();

		const server = express();

		server.use(apiRouter);

		server.listen(PORT, () => {
			logger.info(`Ready on http://localhost:${PORT}`);
		});
	} catch (error) {
		logger.error(error.stack);
		process.exit(1);
	}
}

run();
