import type { toDatesByArray } from 'ts-transformer-dates';
import { Identifier } from 'typescript';

export type Identifiers = {
  libName: Identifier;
  composeName: Identifier;
};

export type ToDatesConverter = Parameters<typeof toDatesByArray>[2];
