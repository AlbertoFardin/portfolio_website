/* eslint-disable import/no-mutable-exports */
let isomorphicLocalstorage;

if (typeof localStorage === "undefined" || localStorage === null) {
  isomorphicLocalstorage = {};
  isomorphicLocalstorage.getItem = (item: string) =>
    isomorphicLocalstorage[item] ? isomorphicLocalstorage[item] : null;
  isomorphicLocalstorage.setItem = (item: string, vItem: string) => {
    isomorphicLocalstorage[item] = vItem;
  };
  isomorphicLocalstorage.removeItem = (item: string) => {
    delete isomorphicLocalstorage[item];
  };
} else {
  isomorphicLocalstorage = localStorage;
}

export default isomorphicLocalstorage;
