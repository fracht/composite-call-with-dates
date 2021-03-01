import {
  AnyFunction,
  CompositeCall as StandardCompositeCall,
  NormalTypeToPathType,
  UnpackPromise,
} from 'composite-call';
import { toDatesByArray } from 'ts-transformer-dates';

const defaultCall = new StandardCompositeCall(() => {}, [], []).call;

export class CompositeCall<
  T extends AnyFunction,
  S extends AnyFunction[] = []
> extends StandardCompositeCall<T, S> {
  public constructor(
    fun: T,
    parameters: NormalTypeToPathType<Parameters<T>>,
    parameterNames?: string[],
    private readonly datePaths?: string[][],
    private readonly dateConverter?: Parameters<typeof toDatesByArray>[2],
  ) {
    super(fun, parameters, parameterNames);
  }

  public call = (sendRequest = CompositeCall.sendRequest) => {
    return defaultCall.call(this, sendRequest).then((output) => {
      if (this.datePaths) {
        return toDatesByArray(output, this.datePaths, this.dateConverter);
      }
    }) as Promise<
      [
        ...{
          [K in keyof S]: S[K] extends AnyFunction
            ? UnpackPromise<ReturnType<S[K]>>
            : never;
        }
      ]
    >;
  };
}
