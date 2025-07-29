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
  return async (tree: Tree, _context: SchematicContext) => {
    const componentRule = await externalSchematic(
      '@schematics/angular',
      'component',
      {
        ...options,
        style: 'scss',
        inlineStyle: false,
        inlineTemplate: false,
      }
    );

    const sharedImportRule: Rule = (tree: Tree) => {
      const modulePath = normalize(`${options.path}/${options.module}`);
      const buffer = tree.read(modulePath);
      if (!buffer) return tree;

      const sourceText = buffer.toString('utf-8');
      const source = ts.createSourceFile(
        modulePath,
        sourceText,
        ts.ScriptTarget.Latest,
        true
      );
      const changes = addImportToModule(
        source,
        modulePath,
        'SharedModule',
        './shared.module'
      );

      const recorder = tree.beginUpdate(modulePath);
      for (const change of changes) {
        if (change instanceof InsertChange) {
          recorder.insertLeft(change.pos, change.toAdd);
        }
      }
      tree.commitUpdate(recorder);
      return tree;
    };

    return chain([componentRule, sharedImportRule]);
  };
}
