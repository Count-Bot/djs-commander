import { Logger, Verbosity } from 'loggage';

export const logger = new Logger({
	name: 'Commander',
	verbosity: [
		Verbosity.FATAL_ERROR,
		Verbosity.ERROR,
		Verbosity.WARNING,
		Verbosity.INFO
	]
});