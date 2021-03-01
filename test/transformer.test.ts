import { compose } from '..';

describe('compose', () => {
  it('single call', async () => {
    interface HelloReturn {
      a: HelloReturnNested;
    }

    interface HelloReturnNested {
      date: Date;
      b: string;
    }

    const time = new Date().getTime();

    function hello(a: string): Promise<HelloReturn> {
      return Promise.resolve({
        a: {
          date: (time as unknown) as Date,
          b: a,
        },
      });
    }

    const [result] = await compose(hello, 'hello').call(async () => {
      return [await hello('hello')] as any;
    });

    expect(result.a.date?.getTime()).toBe(time);
  });

  it('multiple call', async () => {
    interface HelloReturn {
      a: HelloReturnNested;
    }

    interface HelloReturnNested {
      date: Date;
      b: string;
    }

    interface Fun2Return {
      b: Date;
    }

    const time = new Date().getTime();

    function hello(a: string): Promise<HelloReturn> {
      return Promise.resolve({
        a: {
          date: (time as unknown) as Date,
          b: a,
        },
      });
    }

    function fun2(a: HelloReturn): Promise<Fun2Return> {
      return Promise.resolve({
        b: (new Date(a.a.date).toString() as unknown) as Date,
      });
    }

    const [result, result2] = await compose(hello, 'hello')
      .then((out) => compose(fun2, out))
      .call(async () => {
        const helloReturn = await hello('hello');
        return [helloReturn, await fun2(helloReturn)] as any;
      });

    expect(result.a.date?.getTime()).toBe(time);
    expect(result2.b?.getTime()).toBe(
      /** data loss after converting date to string, and backwards */
      new Date(new Date(time).toString()).getTime(),
    );
  });
});
