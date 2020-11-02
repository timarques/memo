import Invocable from "./invocable";

type Result<T> = Promise<T> | T;

interface MemoizeCachedData<T> {
	result: Result<T>,
	value?: T,
	createdAt: number
}

interface MemoizeCache<T, TResult> {
	key: T,
	data: MemoizeCachedData<TResult>,
}

type Callback<T extends unknown[], TResult> = (...args: T) => Result<TResult>;

class Memoize<T extends unknown[], TResult> extends Invocable<T> {
    private cache: MemoizeCache<T, TResult>[] = [];

	private readonly callback: Callback<T, TResult>;

	private readonly maxDuration: number;

	constructor(callback: Callback<T, TResult>, maxDuration = 0) {
		super();
		this.callback = callback;
		this.maxDuration = Math.abs(maxDuration);
	}

	public has(...args: T): boolean {
		return !!this.find(args);
	}

	public value(...args: T): TResult | undefined {
		return this.find(args)?.value;
	}

	public remove(...args: T): boolean {
		const position = this.findPosition(args);
		if (position < 0) return false;
		this.cache.splice(position, 1);
		return true;
	}

	public clear(): void {
		this.cache = [];
	}

	private findPosition(args: T): number {
		return this.cache.findIndex(({ key }) => (
			key.length === args.length
				&& args.every((argument, index) => argument === key[index])
		));
	}

	protected create(args: T): Result<TResult> {
		const result = this.callback(...args);
		const data: MemoizeCachedData<TResult> = {
			result,
			createdAt: Date.now(),
		};
		const currentIndex = this.cache.push({ key: args, data }) - 1;
		if (!(result instanceof Promise)) {
			data.value = result;
			return result;
		}
		return result.then((value) => {
			data.value = value;
			return value;
		}).catch((error: unknown) => {
			this.cache.splice(currentIndex, 1);
			return Promise.reject(error);
		});
	}

	protected find(args: T): MemoizeCachedData<TResult> | undefined {
		const position = this.findPosition(args);
		const date = Date.now();
		return (
			position > -1
			&& (
				this.maxDuration === 0
				|| (
					this.cache[position].data.createdAt + this.maxDuration > date
					|| !this.cache.splice(position, 1)
				)
			)
		) ? this.cache[position].data : undefined;
	}

	protected invoke(...args: T): Result<TResult> {
		return this.find(args)?.result || this.create(args);
	}
}

export { Memoize as default };
export type { Callback, Result };
