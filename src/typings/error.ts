import type { errors } from '../index.js';

export type Errors = typeof errors;

export interface BaseExceptionData {
  code: string,
  message: string,
}