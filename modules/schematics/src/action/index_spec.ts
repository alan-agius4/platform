/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { getFileContent } from '../utility/test';
import { Schema as ActionOptions } from './schema';

describe('Action Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@schematics/angular',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: ActionOptions = {
    name: 'foo',
    path: 'app',
    sourceDir: 'src',
    spec: false,
  };

  it('should create one file', () => {
    const tree = schematicRunner.runSchematic('action', defaultOptions);
    expect(tree.files.length).toEqual(1);
    expect(tree.files[0]).toEqual('/src/app/foo.actions.ts');
  });

  it('should create two files if spec is true', () => {
    const options = {
      ...defaultOptions,
      spec: true,
    };
    const tree = schematicRunner.runSchematic('action', options);
    expect(tree.files.length).toEqual(2);
    expect(
      tree.files.indexOf('/src/app/foo.actions.spec.ts')
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf('/src/app/foo.actions.ts')
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create an enum named "Foo"', () => {
    const tree = schematicRunner.runSchematic('action', defaultOptions);
    const fileEntry = tree.get(tree.files[0]);
    if (fileEntry) {
      const fileContent = fileEntry.content.toString();
      expect(fileContent).toMatch(/export enum FooActionTypes/);
    }
  });
});
