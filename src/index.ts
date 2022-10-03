import { AnyFunction, NormalTypeToPathType } from 'composite-call';

export * from 'composite-call';

import { CompositeCall } from './CompositeCall';
import { ToDatesConverter } from './typings';

export function compose<T extends AnyFunction>(
  fun: T,
  ...args: NormalTypeToPathType<Parameters<T>>
): CompositeCall<T, [T]>;

export function compose<T extends AnyFunction>(
  fun: T,
  converter: ToDatesConverter,
  ...args: NormalTypeToPathType<Parameters<T>>
): CompositeCall<T, [T]>;

export function compose<T extends AnyFunction>(
  names: string[],
  fun: T,
  paths: string[][],
  ...args: NormalTypeToPathType<Parameters<T>>
): CompositeCall<T, [T]>;

export function compose<T extends AnyFunction>(
  names: string[] | T,
  fun: T | unknown,
  paths: string[][] | unknown,
  ...args: NormalTypeToPathType<Parameters<T>>
) {
  if (typeof args[0] === 'function') {
    const [converter, ...restArgs] = args;
    return new CompositeCall<T, [T]>(
      fun as T,
      (restArgs as unknown) as NormalTypeToPathType<Parameters<T>>,
      names as string[],
      [paths as string[][]],
      [converter as ToDatesConverter],
    );
  } else {
    return new CompositeCall<T, [T]>(
      fun as T,
      (args as unknown) as NormalTypeToPathType<Parameters<T>>,
      names as string[],
      [paths as string[][]],
    );
  }
}
