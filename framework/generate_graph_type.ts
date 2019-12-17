import * as fs from 'fs'
import { AppSchema } from '../src/graphql/Schema';

interface Defintion {
  type: string,
  name: string;
  fields: string[];
}

const g = AppSchema;
const prefix = '';

let dict = {};

// generate the type
for(const schema of g) {
  for(const def of schema.definitions) {
    if (def.kind === 'InputObjectTypeDefinition') {
      createTypeScriptFromInput(dict, def);
    } else if (def.kind === 'ObjectTypeDefinition') {
      createTypeScriptFromInput(dict, def);
    } else if (def.kind === 'ObjectTypeExtension') {
      createTypeScriptFromInput(dict, def);
    } else if (def.kind === 'EnumTypeDefinition') {
      createTypeScriptEnum(dict, def);
    }
  }
}

fs.writeFileSync('./src/generated/graph.ts', run(dict));
fs.writeFileSync('./src/generated/graph.json', JSON.stringify(g, null, 2));

function run(dict) {
  const defs = [];
  for(const obj of Object.values<Defintion>(dict)) {
    if (obj.type === 'TYPE') {
      defs.push(
        `  export interface ${prefix}${obj.name} {` + "\r" + obj.fields.join(";\r") + "\r  }"
      );
    } else if (obj.type === 'ENUM') {
      defs.push(
        `  export enum ${prefix}${obj.name} {` + "\r" + obj.fields.join(",\r") + "\r  }"
      )
    }
  }

  return "export declare namespace Graph {\r" +
    defs.join("\r\r") + "\r}";
}

function createTypeScriptEnum(dict, def) {
  const name = def.name.value;

  if (dict[name] === undefined) {
    dict[name] = {
      name,
      type: 'ENUM',
      fields: []
    }
  }

  const t = dict[name];

  for(const value of def.values) {
    t.fields.push(`    ${value.name.value} = "${value.name.value}"`)
  }
}

function createTypeScriptFromInput(dict, def) {
  const name = def.name.value;

  if (dict[name] === undefined) {
    dict[name] = {
      name,
      type: 'TYPE',
      fields: []
    }
  }

  const t = dict[name];

  for(const field of def.fields) {
    const field_name = field.name.value;
    const field_type = mapGraphQLType(field.type);
    const optional = field_type.indexOf('null') >= 0 ? '?' : '';
    t.fields.push(`    ${field_name}${optional}: ${field_type}`);
  }
}

function mapGraphQLType(type) {
  if (type.kind === 'ListType') {
    return `${mapGraphQLNonNullType(type.type)}[]`;
  } else if (type.kind === 'NonNullType') {
    return mapGraphQLNonNullType(type.type);
  } else {
    return ['null', mapGraphQLNonNullType(type)].join(' | ');
  }
}

function mapGraphQLNonNullType(type) {
  const map = {
    "String": "string",
    "Int": "number",
    "Boolean": "boolean"
  }

  if (map[type.name.value] === undefined) {
    return prefix + type.name.value;
  }
  
  return map[type.name.value];
}
