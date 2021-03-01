import { ArrayTypeNode, isArrayTypeNode, TypeNode } from 'typescript';

/** Stolen from https://github.com/lduburas/ts-transformer-dates/blob/master/src/transformer.ts */
export const unbox = (typeNode: TypeNode) => {
  while (isArrayTypeNode(typeNode)) {
    typeNode = (typeNode as ArrayTypeNode).elementType;
  }
  return typeNode;
};
