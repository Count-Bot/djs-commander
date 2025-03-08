export type Awaitable<T> = Promise<T> | T;

export type CommandFn<Args extends unknown[]> = (...args: Args) => unknown;
