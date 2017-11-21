/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { getFileContent } from '../utility/test';
import { Schema as FeatureOptions } from './schema';

describe('Feature Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@schematics/angular',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: FeatureOptions = {
    name: 'foo',
    path: 'app',
    sourceDir: 'src',
    module: '',
    spec: true,
  };

  it('should create all files of a feature', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('feature', options);
    const files = tree.files;
    expect(files.indexOf('/src/app/foo.actions.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/src/app/foo.reducer.ts')).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf('/src/app/foo.reducer.spec.ts')
    ).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/src/app/foo.effects.ts')).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf('/src/app/foo.effects.spec.ts')
    ).toBeGreaterThanOrEqual(0);
  });
});
