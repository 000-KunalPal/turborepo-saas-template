import { AlertTriangle, ArrowRightCircleIcon, Layout } from "lucide-react";
import React from "react";

export const BoardList = () => {
  return (
    <article className="group relative isolate flex flex-col rounded-xl bg-gray-100 dark:bg-gray-800 p-1 pb-0 hover:cursor-pointer">
      <div className="flex flex-1 flex-col justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
        <div
          className="absolute inset-x-14 top-1 h-1 rounded-b-full bg-purple-600"
          aria-hidden="true"
        ></div>
        <div className="flex items-center justify-between gap-3">
          <Layout className="size-5 text-gray-500 dark:text-gray-400" />
          <div className="truncate font-mono text-xs text-gray-600 dark:text-gray-400">
            Marketing
          </div>
        </div>
        <div className="space-y-3 mt-4">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Free Plan
            </span>
            <h3 className="font-medium">
              <a
                className="outline-none focus-visible:text-purple-600 focus-visible:underline"
                href="/app"
              >
                carroteer
              </a>
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-sm border border-dashed border-gray-200 dark:border-gray-700 py-1 px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              <AlertTriangle className="size-4 text-yellow-500" />
              Upgrade to pro
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between overflow-hidden px-3 py-2 text-xs font-book text-primary">
        <span className="transition ease-linear group-hover:-translate-x-[calc(100%+theme(spacing.4))] group-has-[a:focus-visible]:-translate-x-[calc(100%+theme(spacing.4))] motion-reduce:duration-0">
          Updated <time>9 days ago</time>
        </span>
        <span className="flex translate-x-[calc(100%+theme(spacing.4))] items-center gap-1 text-primary transition ease-linear group-hover:translate-x-0 group-has-[a:focus-visible]:translate-x-0 motion-reduce:duration-0">
          Go to Board <ArrowRightCircleIcon className="size-4" />
        </span>
      </div>
    </article>
  );
};
