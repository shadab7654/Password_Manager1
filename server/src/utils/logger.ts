import winston from 'winston';

const logger = winston.createLogger({
	format: winston.format.combine(
		winston.format(info => {
			let newInfo = { ...info };

			// If `toJSON` is present, timestamp fails to be added
			if (newInfo.toJSON) {
				delete newInfo.toJSON;
			}

			if (info instanceof Error) {
				newInfo = {
					...newInfo,
					level: info.level,
					message: info.message,
					stack: info.stack
				};
			}

			return newInfo;
		})(),
		winston.format.timestamp(),
		winston.format.json()
	),
	level: process.env.LOG_LEVEL || 'info',
	transports: [
		new winston.transports.File({
			filename: 'info.log'
		})
	]
});

logger.add(
	new winston.transports.Console({
		format: winston.format.cli()
	})
);

export default logger;
