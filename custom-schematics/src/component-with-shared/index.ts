import {
  apply,
  chain,
  externalSchematic,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { Schema as ComponentOptions } from '@schematics/angular/component/schema';
import { normalize } from 'path';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import * as ts from 'typescript';
import { InsertChange } from '@schematics/angular/utility/change';

export function componentWithShared(options: ComponentOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const name = strings.dasherize(options.name);
    const className = strings.classify(options.name);
    const targetPath = normalize(`${options.path || 'src/app'}/${name}`);

    const templateSource = apply(url('./files'), [
      template({
        ...options,
        ...strings,
      }),
      move(targetPath),
    ]);

    return chain([mergeWith(templateSource)]);
  };
}
