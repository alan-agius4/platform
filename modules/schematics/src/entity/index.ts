/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { normalize } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  apply,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  template,
  url,
  Tree,
  SchematicContext,
} from '@angular-devkit/schematics';
import * as stringUtils from '../strings';
import { Schema as EntityOptions } from './schema';
import {
  addReducerToState,
  addReducerImportToNgModule,
} from '../utility/ngrx-utils';
import { findModuleFromOptions } from '../utility/find-module';

export default function(options: EntityOptions): Rule {
  options.path = options.path ? normalize(options.path) : options.path;
  const sourceDir = options.sourceDir;
  if (!sourceDir) {
    throw new SchematicsException(`sourceDir option is required.`);
  }

  return (host: Tree, context: SchematicContext) => {
    if (options.module) {
      options.module = findModuleFromOptions(host, options);
    }

    const templateSource = apply(url('./files'), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...stringUtils,
        ...(options as object),
      }),
      move(sourceDir),
    ]);

    return chain([
      addReducerToState({ ...options, flat: true }),
      addReducerImportToNgModule({ ...options, flat: true }),
      branchAndMerge(chain([mergeWith(templateSource)])),
    ])(host, context);
  };
}
