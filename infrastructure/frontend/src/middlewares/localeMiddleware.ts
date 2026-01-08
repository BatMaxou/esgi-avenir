import createMiddleware from 'next-intl/middleware';

import { routing } from '../i18n/routing';
import { MiddlewareFactory } from "./stackHandler";
 
export const localeMiddleware: MiddlewareFactory = () => createMiddleware(routing);

