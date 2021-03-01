import { compose } from '..';

describe('', () => {
  it('', async () => {
    interface HelloReturn {
      a: HelloReturnNested;
    }

    interface HelloReturnNested {
      date: Date;
      b: string;
    }

    function hello(a: string): Promise<HelloReturn> {
      return Promise.resolve({
        a: {
          date: (new Date().getTime() as unknown) as Date,
          b: a,
        },
      });
    }

    const [asd] = await compose(hello, 'hello').call(async () => {
      return [await hello('hello')] as any;
    });

    console.log(asd);
  });
});
