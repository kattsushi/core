import {test} from 'ava';
import {Application} from '../src/core/app';
import {AppFactory} from '../src/core/app.factory';
import {OnixJS} from '../src';
import * as path from 'path';
// Test AppFactory
test('Core: AppFactory creates an Application.', async t => {
  class MyApp extends Application {}
  const instance: AppFactory = new AppFactory(MyApp, {modules: []});
  t.truthy(instance.app.start);
  t.truthy(instance.app.stop);
  t.truthy(instance.app.isAlive);
  t.truthy(instance.app.modules);
  t.truthy(instance.app.rpc);
});
// Test AppFactory
test('Core: AppFactory creates duplicated Application.', async t => {
  const onix: OnixJS = new OnixJS({
    cwd: path.join(process.cwd(), 'dist', 'test'),
  });
  await onix.load('TodoApp@todo2.app');
  const error = await t.throws(onix.load('TodoApp@todo2.app'));
  t.is(error.message, 'OnixJS Error: Trying to add duplicated application');
});
// Test AppFactory
test('Core: AppFactory pings missing Application.', async t => {
  const onix: OnixJS = new OnixJS({
    cwd: path.join(process.cwd(), 'dist', 'test'),
  });
  const error = await t.throws(onix.ping('MissingApp'));
  t.is(
    error.message,
    'OnixJS Error: Trying to ping unexisting app "MissingApp".',
  );
});
// Test AppFactory
test('Core: AppFactory fails on installing invalid module.', async t => {
  const error = await t.throws(
    new Promise(() => {
      class MyModule {}
      class MyApp extends Application {}
      new AppFactory(MyApp, {modules: [MyModule]});
    }),
  );
  t.is(
    error.message,
    'OnixJS: Invalid Module "MyModule", it must provide a module config ({ models: [], services: [], components: [] })',
  );
});
