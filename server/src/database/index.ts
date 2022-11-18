import mongoose from 'mongoose';
import config from '../config';
import logger from '../utils/logger';

export default (): Promise<void> =>
	new Promise((resolve, reject) => {
		mongoose.connect(config.DB.URI || '', error => {
			if (error) {
				reject(error);
			}

			logger.info('Database Connected');
			resolve();
		});
	});
