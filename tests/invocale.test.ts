import Invocable from "../lib/invocable";

class FakeInvocable<T extends unknown[], TResult> extends Invocable<T> {

	private readonly callback: (...args: T) => TResult;

	constructor(callback: (...args: T) => TResult) {
		super();
		this.callback = callback;
	}

	protected invoke(...args: T): TResult {
		return this.callback(...args);
	}

}

test("invoke", () => {
	const callback = jest.fn((number: number) => number);
	const invocable = new FakeInvocable(callback);
	expect(invocable(1)).toBe(1);
	expect(invocable(2)).toBe(2);
	expect(callback).toBeCalledTimes(2);
});
