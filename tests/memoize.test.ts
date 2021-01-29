import { advanceBy } from "jest-date-mock";
import memo from "../lib/memo";

test("memo()", () => {
	const callback = jest.fn((...args: number[]) => args.reduce((a, b) => a * b, 1));
	const memoized = memo(callback);
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

test("has", () => {
	const memoized = memo((number?: number) => number);
	expect(memoized.has(1)).toBeFalsy();
	memoized(1);
	expect(memoized.has(1)).toBeTruthy();
	expect(memoized.has()).toBeFalsy();
});

test("remove", () => {
	const memoized = memo(() => undefined);
	expect(memoized.remove()).toBeFalsy();
	memoized();
	expect(memoized.remove()).toBeTruthy();
	expect(memoized.remove()).toBeFalsy();
});

test("clear", () => {
	const memoized = memo(() => undefined);
	expect(memoized.has()).toBeFalsy();
	memoized();
	expect(memoized.has()).toBeTruthy();
	memoized.clear();
	expect(memoized.has()).toBeFalsy();
});

test("duration option", () => {
	const memoized = memo(() => undefined, { duration: 20 });
	memoized();
	expect(memoized.has()).toBeTruthy();
	advanceBy(20);
	expect(memoized.has()).toBeFalsy();
});
