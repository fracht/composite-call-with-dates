# composite-call-with-dates

> Package which makes [ts-transformer-dates](https://github.com/lduburas/ts-transformer-dates#readme) and [composite-call](https://github.com/ArtiomTr/composite-call#readme) packages work well together

[![npm version](https://img.shields.io/npm/v/composite-call-with-dates)](https://www.npmjs.com/package/composite-call-with-dates)
[![npm downloads](https://img.shields.io/npm/dw/composite-call-with-dates)](https://www.npmjs.com/package/composite-call-with-dates)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/composite-call-with-dates)](https://www.npmjs.com/package/composite-call-with-dates)

## Install

```bash
npm install composite-call-with-dates
```

Or

```bash
yarn add composite-call-with-dates
```

## Usage

1. Replace [dates](https://github.com/lduburas/ts-transformer-dates#readme) and [composite-call](https://github.com/ArtiomTr/composite-call#readme) transformers with this transformer:

```diff
- const datesTransformer = require('ts-transformer-dates/lib/transformer').default;
- const composeTransformer = require('composite-call/dist/transformer');
+ const composeWithDatesTransfomrer = require('composite-call-with-dates/dist/transformer').default;

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          getCustomTransformers: function(program) {
            return {
                before: [
-                   composeTransformer(program),
-                   datesTransformer(program),
+                   composeWithDatesTransfomrer
                ],
            };
          },
        },
      },
    ]
  }
}
```

2. And then, instead of:

```ts
import { compose } from 'composite-call';
```

Use:

```ts
import { compose } from 'composite-call-with-dates';
```

And that's it!

## More information

More information about Api and transformers you can find here:
- [ts-transformer-dates](https://github.com/lduburas/ts-transformer-dates#readme)
- [composite-call](https://github.com/ArtiomTr/composite-call#readme)

## License

MIT © [Artiom Tretjakovas](https://github.com/ArtiomTr)

[Created with aqu 🌊](https://github.com/ArtiomTr/aqu#readme)
