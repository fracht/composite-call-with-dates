import {
  getComposedFunctionData,
  isComposeImportExpression,
} from 'composite-call/dist/transformer-utils';
import { Node, Program, TransformationContext } from 'typescript';

import type { TransformerConfig } from './config';
import { convertDates } from './convertDates';
import { createComposeCallExpression } from './createComposeCallExpression';
import { getReturnType } from './getReturnType';
import { isComposeCallExpression } from './isComposeCallExpression';
import type { Identifiers } from './typings';
import { unboxPromise } from './unboxPromise';

export const visitor = (
  node: Node,
  program: Program,
  context: TransformationContext,
  identifiers: Identifiers,
  config: TransformerConfig,
): Node | Node[] | undefined => {
  if (!node) return node;

  const { libName } = identifiers;

  const typeChecker = program.getTypeChecker();

  if (isComposeImportExpression(node, config)) {
    const importNode = context.factory.createVariableStatement(undefined, [
      context.factory.createVariableDeclaration(
        libName,
        undefined,
        undefined,
        context.factory.createCallExpression(
          context.factory.createIdentifier('require'),
          undefined,
          [context.factory.createStringLiteral(config.modulePath)],
        ),
      ),
    ]);

    return [node, importNode];
  }

  if (!isComposeCallExpression(node, typeChecker, config)) {
    return node;
  }

  const [fun, ...otherArguments] = node.arguments;

  const composedFunctionData = getComposedFunctionData(fun, typeChecker);
  const returnType = getReturnType(fun, typeChecker);

  const dates = context.factory.createArrayLiteralExpression(
    returnType
      ? convertDates(
          unboxPromise(returnType, typeChecker),
          typeChecker,
          context.factory,
          [],
          node,
        )
      : [],
  );

  if (composedFunctionData) {
    return createComposeCallExpression(
      composedFunctionData,
      identifiers,
      fun,
      dates,
      otherArguments,
      context,
    );
  }

  return node;
};
