import test from 'ava';
import {main} from '../dist/main';
import {JSDOM} from 'jsdom';

test('works with single component', (t) => {
  const {document} = new JSDOM(`<div x-data="{}"></div>`).window;
  main(document);
  t.is(
    document.querySelector('[x-data]').getAttribute('x-init'),
    'init && init();'
  );
});

test('works with multiple components', (t) => {
  const {document} = new JSDOM(
    `<div x-data="{}"></div>
<div x-data></div>`
  ).window;
  main(document);
  t.is(document.querySelectorAll('[x-init]').length, 2);
  const components = document.querySelectorAll('[x-data]');
  t.is(components[0].getAttribute('x-init'), 'init && init();');
  t.is(components[1].getAttribute('x-init'), 'init && init();');
});

test('works with existing init functions', (t) => {
  const {document} = new JSDOM(
    `<div x-data="{}" x-init="console.log(window.location.href)"></div>`
  ).window;
  main(document);
  t.is(
    document.querySelector('[x-data]').getAttribute('x-init'),
    'console.log(window.location.href);init && init();'
  );
});
