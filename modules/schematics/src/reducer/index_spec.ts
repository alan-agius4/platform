/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Tree, VirtualTree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createAppModule, getFileContent } from '../utility/test';
import { Schema as ReducerOptions } from './schema';

describe('Reducer Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@schematics/angular',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: ReducerOptions = {
    name: 'foo',
    path: 'app',
    sourceDir: 'src',
    spec: false,
  };

  let appTree: Tree;

  beforeEach(() => {
    appTree = new VirtualTree();
    appTree = createAppModule(appTree);
  });

  it('should create one file', () => {
    const tree = schematicRunner.runSchematic('reducer', defaultOptions);
    expect(tree.files.length).toEqual(1);
    expect(tree.files[0]).toEqual('/src/app/foo.reducer.ts');
  });

  it('should create two files if spec is true', () => {
    const options = {
      ...defaultOptions,
      spec: true,
    };
    const tree = schematicRunner.runSchematic('reducer', options);
    expect(tree.files.length).toEqual(2);
    expect(
      tree.files.indexOf('/src/app/foo.reducer.spec.ts')
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf('/src/app/foo.reducer.ts')
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create an reducer function', () => {
    const tree = schematicRunner.runSchematic('reducer', defaultOptions);
    const fileEntry = tree.get(tree.files[0]);
    if (fileEntry) {
      const fileContent = fileEntry.content.toString();
      expect(fileContent).toMatch(/export function reducer/);
    }
  });

  it('should import into a specified module', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('reducer', options, appTree);
    const appModule = getFileContent(tree, '/src/app/app.module.ts');

    expect(appModule).toMatch(/import \* as fromFoo from '.\/foo.reducer'/);
  });
});
