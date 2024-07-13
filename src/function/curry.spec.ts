import { describe, it, expect, expectTypeOf } from 'vitest';
import { curry } from './curry';

describe('curry', () => {
  it('should throw an error when a function that has no parameters is received', () => {
    const fn = () => 'test';

    expect(() => curry(fn)).toThrowError('`func` must have at least one argument that is not a rest parameter.');
  });

  it('should throw an error when a function that only has `rest parameters` is received', () => {
    const fn = (...rest: unknown[]) => rest;

    expect(() => curry(fn)).toThrowError('`func` must have at least one argument that is not a rest parameter.');
  });

  it('should curry based on the number of arguments given', () => {
    const fn = (a: number, b: number, c: number, d: number) => [a, b, c, d];
    const curried = curry(fn);
    const expected = [1, 2, 3, 4];

    expect(curried(1)(2)(3)(4)).toEqual(expected);
  });

  it('should run the function immediately when `run` method called', () => {
    const fn = (a: number, b?: number, c?: number) => [a, b, c];
    const curried = curry(fn);

    expect(curried(1).run()).toEqual([1, undefined, undefined]);
    expect(curried(1)(2).run()).toEqual([1, 2, undefined]);
  });

  it('should inference type correctly', () => {
    const fn = (a: number, b: string, c: boolean) => ({ a, b, c });
    const curried = curry(fn);

    expectTypeOf(curried).parameters.toEqualTypeOf<[number]>();
    expectTypeOf(curried(1)).parameters.toEqualTypeOf<[string]>();
    expectTypeOf(curried(1)).not.toEqualTypeOf<{ a: number; b: string; c: boolean }>();
    expectTypeOf(curried(1)('a')).parameters.toEqualTypeOf<[boolean]>();
    expectTypeOf(curried(1)('a')).not.toEqualTypeOf<{ a: number; b: string; c: boolean }>();
    expectTypeOf(curried(1)('a')(true)).toEqualTypeOf<{ a: number; b: string; c: boolean }>();
  });

  it('should inference type correctly when optional parameters exist', () => {
    const fn = (a: number, b?: string, c?: boolean) => ({ a, b, c });
    const curried = curry(fn);

    expectTypeOf(curried).parameters.toEqualTypeOf<[number]>();
    expectTypeOf(curried(1)).parameters.toEqualTypeOf<[string | undefined]>();
    expectTypeOf(curried(1)).not.toEqualTypeOf<{ a: number; b: string; c: boolean }>();
    expectTypeOf(curried(1)('a')).parameters.toEqualTypeOf<[boolean | undefined]>();
    expectTypeOf(curried(1)('a')).not.toEqualTypeOf<{ a: number; b: string | undefined; c: boolean | undefined }>();
    expectTypeOf(curried(1)('a')(true)).toEqualTypeOf<{ a: number; b: string | undefined; c: boolean | undefined }>();
  });

  it('should inference type correctly when rest parameters exist', () => {
    const fn = (a: number, b: string, c: boolean, ...rest: any[]) => ({ a, b, c, rest });
    const curried = curry.flexible(fn);

    expectTypeOf(curried).parameters.toEqualTypeOf<[number] | [number, string] | [number, string, boolean]>();
    expectTypeOf(curried(1)).parameters.toEqualTypeOf<[string] | [string, boolean]>();
    expectTypeOf(curried(1)).not.toEqualTypeOf<{ a: number; b: string; c: boolean; rest: any[] }>();
    expectTypeOf(curried(1, 'a')).parameters.toEqualTypeOf<[boolean]>();
    expectTypeOf(curried(1, 'a')).not.toEqualTypeOf<{ a: number; b: string; c: boolean; rest: any[] }>();
    expectTypeOf(curried(1)('a')).parameters.toEqualTypeOf<[boolean]>();
    expectTypeOf(curried(1)('a')).not.toEqualTypeOf<{ a: number; b: string; c: boolean; rest: any[] }>();
    expectTypeOf(curried(1)('a')(true)).toEqualTypeOf<{ a: number; b: string; c: boolean; rest: any[] }>();
    expectTypeOf(curried(1, 'a')(true)).toEqualTypeOf<{ a: number; b: string; c: boolean; rest: any[] }>();
    expectTypeOf(curried(1)('a', true)).toEqualTypeOf<{ a: number; b: string; c: boolean; rest: any[] }>();
    expectTypeOf(curried(1, 'a', true)).toEqualTypeOf<{ a: number; b: string; c: boolean; rest: any[] }>();
  });
});

describe('curry.flexible', () => {
  it('should throw an error when a function that has no parameters is received', () => {
    const fn = () => 'test';

    expect(() => curry.flexible(fn)).toThrowError(
      '`func` must have at least one argument that is not a rest parameter.'
    );
  });

  it('should throw an error when a function that only has `rest parameters` is received', () => {
    const fn = (...rest: unknown[]) => rest;

    expect(() => curry.flexible(fn)).toThrowError(
      '`func` must have at least one argument that is not a rest parameter.'
    );
  });

  it('should curry based on the number of arguments given', () => {
    const fn = (a: number, b: number, c: number, d: number) => [a, b, c, d];
    const curried = curry.flexible(fn);
    const expected = [1, 2, 3, 4];

    expect(curried(1)(2)(3)(4)).toEqual(expected);
    expect(curried(1)(2, 3, 4)).toEqual(expected);
    expect(curried(1, 2)(3, 4)).toEqual(expected);
    expect(curried(1, 2, 3, 4)).toEqual(expected);
  });

  it('should run the function immediately when `run` method called', () => {
    const fn = (a: number, b?: number, c?: number) => [a, b, c];
    const curried = curry.flexible(fn);

    expect(curried(1).run()).toEqual([1, undefined, undefined]);
    expect(curried(1)(2).run()).toEqual([1, 2, undefined]);
    expect(curried(1, 2).run()).toEqual([1, 2, undefined]);
  });

  it('should inference type correctly', () => {
    const fn = (a: number, b: string, c: boolean) => ({ a, b, c });
    const curried = curry.flexible(fn);

    expectTypeOf(curried).parameters.toEqualTypeOf<[number] | [number, string] | [number, string, boolean]>();
    expectTypeOf(curried(1)).parameters.toEqualTypeOf<[string] | [string, boolean]>();
    expectTypeOf(curried(1)).not.toEqualTypeOf<{ a: number; b: string; c: boolean }>();
    expectTypeOf(curried(1, 'a')).parameters.toEqualTypeOf<[boolean]>();
    expectTypeOf(curried(1, 'a')).not.toEqualTypeOf<{ a: number; b: string; c: boolean }>();
    expectTypeOf(curried(1)('a')).parameters.toEqualTypeOf<[boolean]>();
    expectTypeOf(curried(1)('a')).not.toEqualTypeOf<{ a: number; b: string; c: boolean }>();
    expectTypeOf(curried(1)('a')(true)).toEqualTypeOf<{ a: number; b: string; c: boolean }>();
    expectTypeOf(curried(1, 'a')(true)).toEqualTypeOf<{ a: number; b: string; c: boolean }>();
    expectTypeOf(curried(1)('a', true)).toEqualTypeOf<{ a: number; b: string; c: boolean }>();
    expectTypeOf(curried(1, 'a', true)).toEqualTypeOf<{ a: number; b: string; c: boolean }>();
  });

  it('should inference type correctly when optional parameters exist', () => {
    const fn = (a: number, b?: string, c?: boolean) => ({ a, b, c });
    const curried = curry.flexible(fn);

    expectTypeOf(curried).parameters.toEqualTypeOf<
      [number] | [number, string | undefined] | [number, string | undefined, boolean | undefined]
    >();
    expectTypeOf(curried(1)).parameters.toEqualTypeOf<
      [string | undefined] | [string | undefined, boolean | undefined]
    >();
    expectTypeOf(curried(1)).not.toEqualTypeOf<{ a: number; b: string; c: boolean }>();
    expectTypeOf(curried(1, 'a')).parameters.toEqualTypeOf<[boolean | undefined]>();
    expectTypeOf(curried(1, 'a')).not.toEqualTypeOf<{ a: number; b: string | undefined; c: boolean | undefined }>();
    expectTypeOf(curried(1)('a')).parameters.toEqualTypeOf<[boolean | undefined]>();
    expectTypeOf(curried(1)('a')).not.toEqualTypeOf<{ a: number; b: string | undefined; c: boolean | undefined }>();
    expectTypeOf(curried(1)('a')(true)).toEqualTypeOf<{ a: number; b: string | undefined; c: boolean | undefined }>();
    expectTypeOf(curried(1, 'a')(true)).toEqualTypeOf<{ a: number; b: string | undefined; c: boolean | undefined }>();
    expectTypeOf(curried(1)('a', true)).toEqualTypeOf<{ a: number; b: string | undefined; c: boolean | undefined }>();
    expectTypeOf(curried(1, 'a', true)).toEqualTypeOf<{ a: number; b: string | undefined; c: boolean | undefined }>();
  });

  it('should inference type correctly when rest parameters exist', () => {
    const fn = (a: number, b: string, c: boolean, ...rest: any[]) => ({ a, b, c, rest });
    const curried = curry.flexible(fn);

    expectTypeOf(curried).parameters.toEqualTypeOf<[number] | [number, string] | [number, string, boolean]>();
    expectTypeOf(curried(1)).parameters.toEqualTypeOf<[string] | [string, boolean]>();
    expectTypeOf(curried(1)).not.toEqualTypeOf<{ a: number; b: string; c: boolean; rest: any[] }>();
    expectTypeOf(curried(1, 'a')).parameters.toEqualTypeOf<[boolean]>();
    expectTypeOf(curried(1, 'a')).not.toEqualTypeOf<{ a: number; b: string; c: boolean; rest: any[] }>();
    expectTypeOf(curried(1)('a')).parameters.toEqualTypeOf<[boolean]>();
    expectTypeOf(curried(1)('a')).not.toEqualTypeOf<{ a: number; b: string; c: boolean; rest: any[] }>();
    expectTypeOf(curried(1)('a')(true)).toEqualTypeOf<{ a: number; b: string; c: boolean; rest: any[] }>();
    expectTypeOf(curried(1, 'a')(true)).toEqualTypeOf<{ a: number; b: string; c: boolean; rest: any[] }>();
    expectTypeOf(curried(1)('a', true)).toEqualTypeOf<{ a: number; b: string; c: boolean; rest: any[] }>();
    expectTypeOf(curried(1, 'a', true)).toEqualTypeOf<{ a: number; b: string; c: boolean; rest: any[] }>();
  });
});
