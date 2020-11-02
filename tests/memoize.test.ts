import { advanceBy } from "jest-date-mock";
import Memoize from "../lib/memoize";

test("invoke", () => {
	const callback = jest.fn((...args: number[]) => args.reduce((a, b) => a * b, 1));
	const memoized = new Memoize(callback);
	expect(memoized(1)).toBe(1);
	expect(callback).toBeCalledWith(1);
	expect(memoized.has(1)).toBeTruthy();
	expect(memoized(1)).toBe(1);
	expect(memoized(2)).toBe(2);
	expect(memoized(2, 2)).toBe(4);
	expect(callback).toBeCalledWith(2, 2);
	expect(memoized(2, 2)).toBe(4);
	expect(callback).toBeCalledTimes(3);
});

test("invoke with promises", async () => {
	const callback = jest.fn((number: number) => Promise.resolve(number * number));
	const memoized = new Memoize(callback);
	const result = memoized(1);
	expect(result).toBeInstanceOf(Promise);
	expect(await result).toBe(1);
	expect(memoized(2)).toBeInstanceOf(Promise);
	expect(callback).toBeCalledTimes(2);
});

test("invoke with rejected promises", async () => {
	expect.assertions(4);
	const callback = jest.fn(() => Promise.reject(new Error()));
	const memoized = new Memoize(callback);
	const promise = memoized();
	expect(memoized.has()).toBeTruthy();
	try {
		await promise;
	} catch (error) {
		expect(error).toBeInstanceOf(Error);
	}
	expect(memoized.has()).toBeFalsy();
	expect(callback).toBeCalled();
});

test("has", () => {
	const memoized = new Memoize((number?: number) => number);
	expect(memoized.has(1)).toBeFalsy();
	memoized(1);
	expect(memoized.has(1)).toBeTruthy();
	expect(memoized.has()).toBeFalsy();
});

test("remove", () => {
	const memoized = new Memoize(() => undefined);
	expect(memoized.remove()).toBeFalsy();
	memoized();
	expect(memoized.remove()).toBeTruthy();
	expect(memoized.remove()).toBeFalsy();
});

test("value", () => {
	const memoized = new Memoize((number: number) => number);
	expect(memoized.value(1)).toBeUndefined();
	memoized(1);
	expect(memoized.value(1)).toBe(1);
	expect(memoized.value(0)).toBeUndefined();
});

test("value with promises", async () => {
	const memoized = new Memoize((number: number) => Promise.resolve(number));
	await memoized(2);
	expect(memoized.value(2)).toBe(2);
	expect(memoized.value(1)).toBeUndefined();
});

test("clear", () => {
	const memoized = new Memoize(() => undefined);
	expect(memoized.has()).toBeFalsy();
	memoized();
	expect(memoized.has()).toBeTruthy();
	memoized.clear();
	expect(memoized.has()).toBeFalsy();
});

test("maxDuration option", () => {
	const memoized = new Memoize(() => undefined, 20);
	memoized();
	expect(memoized.has()).toBeTruthy();
	advanceBy(20);
	expect(memoized.has()).toBeFalsy();
});
