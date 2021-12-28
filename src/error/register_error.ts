import { CommanderError } from './commander_error.js';
import { readFile } from 'fs';
import { CommanderErrorCodes } from '../typings/error.js';

let errorLogData: { [K in CommanderErrorCodes]?: number } = {};

readFile('./logs/errors.json', 'utf8', (err, data) => {
	if (err) throw err;

	errorLogData = JSON.parse(data);
});

export function registerError(error: CommanderError): void {
	if (error.code in errorLogData) errorLogData[error.code] = 1;
	else errorLogData[error.code]!++;
}