import {
  ArrayLiteralExpression,
  isArrayTypeNode,
  Node,
  NodeFactory,
  PropertyDeclaration,
  StringLiteral,
  Symbol,
  Type,
  TypeChecker,
  TypeNode,
} from 'typescript';

import { unbox } from './unbox';

/** Stolen from https://github.com/lduburas/ts-transformer-dates/blob/master/src/transformer.ts */
export const convertDates = (
  type: Type,
  typeChecker: TypeChecker,
  factory: NodeFactory,
  prefix: StringLiteral[],
  node: Node,
): ArrayLiteralExpression[] => {
  const properties = typeChecker.getPropertiesOfType(type);
  const getTypeOfProperty = (property: Symbol) => {
    const propertyType = unbox(
      (property.valueDeclaration as PropertyDeclaration)?.type as TypeNode,
    );
    return typeChecker.getTypeFromTypeNode(propertyType).getNonNullableType();
  };
  const isInterfaceOrArray = (property: Symbol): boolean => {
    const propertyType = (property.valueDeclaration as PropertyDeclaration)
      ?.type as TypeNode;
    return (
      typeChecker.getTypeFromTypeNode(propertyType).isClassOrInterface() ||
      isArrayTypeNode(propertyType)
    );
  };
  return properties
    .filter((property) => {
      if (isInterfaceOrArray(property)) return true;
      return getTypeOfProperty(property)?.getSymbol()?.getName() === 'Date';
    })
    .reduce((props, property) => {
      if (isInterfaceOrArray(property)) {
        const propertyType = getTypeOfProperty(property);
        if (propertyType.getSymbol()?.getName() !== 'Date')
          return props.concat(
            convertDates(
              propertyType,
              typeChecker,
              factory,
              prefix.concat(factory.createStringLiteral(property.getName())),
              node,
            ),
          );
      }
      return props.concat(
        factory.createArrayLiteralExpression(
          prefix.concat([factory.createStringLiteral(property.getName())]),
        ),
      );
    }, [] as ArrayLiteralExpression[]);
};
