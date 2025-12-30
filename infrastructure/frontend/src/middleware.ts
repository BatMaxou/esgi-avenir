import { stackMiddlewares } from "@/middlewares/stackHandler";
import { accessMiddleware } from "@/middlewares/accessMiddleware";
import { localeMiddleware } from "@/middlewares/localeMiddleware";

const middlewares = [localeMiddleware, accessMiddleware];

export default stackMiddlewares(middlewares);

export const config = {
 matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|assets|sitemap.xml|robots.txt).*)'],
};
