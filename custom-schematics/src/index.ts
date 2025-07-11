import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  template,
  url
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { Schema } from './schema';

export function standaloneComponent(options:Schema ): Rule {
  return () => {
    const sourceTemplate = url('./files');

    const preparedTemplate = apply(sourceTemplate, [
      template({
        ...options,
        ...strings
      }),
      move(`${options.path}/${strings.dasherize(options.name)}`)
    ]);

    return chain([
      mergeWith(preparedTemplate)
    ]);
  };
}
