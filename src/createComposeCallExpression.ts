import {
  ArrayLiteralExpression,
  Expression,
  TransformationContext,
} from 'typescript';

import { Identifiers } from './typings';

export const createComposeCallExpression = (
  parameterNames: string[],
  identifiers: Identifiers,
  fun: Expression,
  paths: ArrayLiteralExpression,
  funArguments: Expression[],
  context: TransformationContext,
) =>
  context.factory.createCallExpression(
    context.factory.createPropertyAccessExpression(
      identifiers.libName,
      identifiers.composeName,
    ),
    undefined,
    [
      context.factory.createArrayLiteralExpression(
        parameterNames.map((parameter) =>
          context.factory.createStringLiteral(parameter),
        ),
      ),
      fun,
      paths,
      ...funArguments,
    ],
  );
