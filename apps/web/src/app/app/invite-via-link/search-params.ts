import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const searchParamsParsers = {
  joinCode: parseAsString,
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);
