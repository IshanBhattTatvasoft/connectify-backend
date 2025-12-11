// Mark a route as public so authentication is skipped.
// @Public() written above a controller method makes the route public and skips authentication check.
// SetMetadata: Attaches custom metadata (flags) to route handler

import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
