import { unboxPropertyDeclaration } from 'composite-call/dist/transformer-utils';
import {
  isArrowFunction,
  isFunctionDeclaration,
  isIdentifier,
  isMethodDeclaration,
  isPropertyDeclaration,
  isVariableDeclaration,
  Node,
  Type,
  TypeChecker,
} from 'typescript';

export const getReturnType = (
  fun: Node,
  typeChecker: TypeChecker,
): Type | undefined => {
  fun = unboxPropertyDeclaration(fun);
  if (isIdentifier(fun)) {
    const declaration = typeChecker
      .getSymbolAtLocation(fun)
      ?.getDeclarations()?.[0];

    if (
      declaration &&
      (isVariableDeclaration(declaration) ||
        isPropertyDeclaration(declaration)) &&
      declaration.initializer &&
      isArrowFunction(declaration.initializer)
    ) {
      const initializer = declaration.initializer;

      if (initializer.type) {
        return typeChecker.getTypeFromTypeNode(initializer.type);
      }
    }

    if (
      declaration &&
      (isFunctionDeclaration(declaration) || isMethodDeclaration(declaration))
    ) {
      const signature = typeChecker.getSignatureFromDeclaration(declaration);

      if (signature) {
        return signature.getReturnType();
      }
    }
  }

  return undefined;
};
