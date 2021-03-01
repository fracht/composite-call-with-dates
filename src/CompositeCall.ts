import {
  AnyFunction,
  CompositeCall as StandardCompositeCall,
  NormalTypeToPathType,
  NormalTypeToStrictPathType,
  UnpackPromise,
} from 'composite-call';
import { toDatesByArray } from 'ts-transformer-dates';

import { ToDatesConverter } from './typings';

export class CompositeCall<
  T extends AnyFunction,
  S extends AnyFunction[] = []
> extends StandardCompositeCall<T, S> {
  private datePaths: (string[][] | undefined)[] = [];
  private converters: ToDatesConverter[] = [];

  public constructor(
    fun: T,
    parameters: NormalTypeToPathType<Parameters<T>>,
    parameterNames?: string[],
    datePaths: (string[][] | undefined)[] = [undefined],
    dateConverter: (ToDatesConverter | undefined)[] = [undefined],
  ) {
    super(fun, parameters, parameterNames);
    if (datePaths) {
      this.datePaths = datePaths;
      this.converters = dateConverter;
    }
  }

  public then = <K extends Array<AnyFunction>>(
    onfulfilled: (
      value: NormalTypeToStrictPathType<UnpackPromise<ReturnType<T>>>,
    ) => CompositeCall<AnyFunction, K> | StandardCompositeCall<AnyFunction, K>,
  ): CompositeCall<T, [...S, ...K]> => {
    const compositeCall = (this.fulfill(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onfulfilled as any,
    ) as unknown) as CompositeCall<T, K>;
    this.datePaths.push(...compositeCall.datePaths);
    this.converters.push(...compositeCall.converters);
    this.sequence.push(...compositeCall.getSequence());
    return (this as unknown) as CompositeCall<T, [...S, ...K]>;
  };

  public call = (sendRequest = CompositeCall.sendRequest) => {
    const out = sendRequest<S>(this.getPreparedSequence(), this.fun);

    return out.then((output) =>
      output.map((value, index) => {
        const paths = this.datePaths[index];
        if (paths) {
          return toDatesByArray(value, paths, this.converters[index]);
        } else {
          return value;
        }
      }),
    ) as typeof out;
  };
}
