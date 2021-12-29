import { Logger, Verbosity } from 'loggage';

export const logger = new Logger({
	name: process.env.LOGGER_NAME ?? 'Commander',
	verbosity: Verbosity.INFO,
});