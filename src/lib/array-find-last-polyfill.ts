// Array.prototype.findLast / findLastIndex are missing in Chrome < 97,
// Safari < 15.4, Firefox < 104 and Samsung Internet < 18. Vercel's hosted
// Speed Insights script (/_vercel/speed-insights/script.js) calls findLast
// without a fallback, so those browsers throw
// "te.findLast is not a function" (Sentry SSOBIG-HOME-35).

type Predicate = (value: unknown, index: number, array: unknown[]) => unknown;

function findLastIndexOf(
  list: ArrayLike<unknown>,
  predicate: Predicate,
  thisArg: unknown
): number {
  if (typeof predicate !== "function") {
    throw new TypeError("predicate must be a function");
  }

  for (let index = list.length - 1; index >= 0; index -= 1) {
    if (predicate.call(thisArg, list[index], index, list as unknown[])) {
      return index;
    }
  }

  return -1;
}

function definePolyfill(name: string, value: unknown) {
  if (name in Array.prototype) {
    return;
  }

  Object.defineProperty(Array.prototype, name, {
    value,
    writable: true,
    configurable: true,
    enumerable: false,
  });
}

definePolyfill(
  "findLast",
  function findLast(this: unknown[], predicate: Predicate, thisArg?: unknown) {
    const index = findLastIndexOf(this, predicate, thisArg);
    return index === -1 ? undefined : this[index];
  }
);

definePolyfill(
  "findLastIndex",
  function findLastIndex(
    this: unknown[],
    predicate: Predicate,
    thisArg?: unknown
  ) {
    return findLastIndexOf(this, predicate, thisArg);
  }
);

export {};
