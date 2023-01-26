import { lazy } from "react";

export function lazyLoading(path: string, namedExport?: string) {
  return lazy(() => {
    const promise = import(/* @vite-ignore */ path);
    if (namedExport)
      return promise.then((module) => ({ default: module[namedExport] }));
    return promise;
  });
}
