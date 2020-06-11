/* eslint-env browser */

const PKG_VERSION = 'PKG_VERSION';
export const version = PKG_VERSION;

type Defferrer = (cb: () => void) => void;

declare global {
  interface Window {
    deferLoadingAlpine: Defferrer;
    Alpine: any;
  }
}

export function main(document: Document) {
  Array.from(document.querySelectorAll('[x-data]')).forEach((element) => {
    const currentInit = element.getAttribute('x-init');
    const initString = currentInit ? `${currentInit};` : '';
    const newInit = `${initString}init && init();`;
    element.setAttribute('x-init', newInit);
  });
}

if (typeof window !== 'undefined') {
  // Thanks Spruce
  const deferrer: Defferrer =
    window.deferLoadingAlpine || ((callback) => callback());

  window.deferLoadingAlpine = function (callback) {
    main(document);
    deferrer(callback);
  };
}
