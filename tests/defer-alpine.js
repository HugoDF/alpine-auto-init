import test from 'ava';
import {JSDOM} from 'jsdom';

test('deferLoadingAlpine smoke test', async (t) => {
  const {window} = new JSDOM(`<div x-data="{}" x-init="doSomething()"></div>`);
  const {document} = window;
  let existingCallbackCalled = false;
  const existingCallback = (cb) => {
    existingCallbackCalled = true;
    cb();
  };

  window.deferLoadingAlpine = existingCallback;
  global.window = window;
  global.document = document;

  await import('../dist/main');

  t.not(window.deferLoadingAlpine, existingCallback);

  let mainCallbackCalled = false;
  window.deferLoadingAlpine(() => {
    mainCallbackCalled = true;
  });

  t.true(existingCallbackCalled);
  t.true(mainCallbackCalled);
  t.is(
    document.querySelector('[x-data]').getAttribute('x-init'),
    'doSomething();init && init();'
  );
});
