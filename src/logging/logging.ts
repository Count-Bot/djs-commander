import { Logger, Verbosity } from 'loggage';

export const logger = new Logger({
	name: 'commander',
	verbosity: [
		Verbosity.FATAL_ERROR,
		Verbosity.ERROR,
		Verbosity.WARNING,
		Verbosity.INFO
	]
});