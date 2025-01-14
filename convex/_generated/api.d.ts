/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as aiTools from "../aiTools.js";
import type * as analytics from "../analytics.js";
import type * as artworks from "../artworks.js";
import type * as content from "../content.js";
import type * as init from "../init.js";
import type * as portfolio from "../portfolio.js";
import type * as tokens from "../tokens.js";
import type * as users from "../users.js";
import type * as videos from "../videos.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  aiTools: typeof aiTools;
  analytics: typeof analytics;
  artworks: typeof artworks;
  content: typeof content;
  init: typeof init;
  portfolio: typeof portfolio;
  tokens: typeof tokens;
  users: typeof users;
  videos: typeof videos;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
