import {
  AnyFunction,
  CompositeCall,
  NormalTypeToPathType,
  compose as normalCompose,
} from 'composite-call';

export function compose<T extends AnyFunction>(
  fun: T,
  ...args: NormalTypeToPathType<Parameters<T>>
): CompositeCall<T>;

export function compose<T extends AnyFunction>(
  parameterNames: string[],
  fun: T,
  ...args: NormalTypeToPathType<Parameters<T>>
): CompositeCall<T>;

export function compose<T extends AnyFunction>(
  funOrNames: T | string[],
  ...args: NormalTypeToPathType<Parameters<T>>
) {
  return normalCompose((funOrNames as unknown) as AnyFunction, ...args);
}
