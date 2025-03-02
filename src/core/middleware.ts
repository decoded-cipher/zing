import { readdirSync } from "fs";
import { join } from "path";
import { EnhancedResponse, IRouter, MiddlewareFunction, Request } from "../types";

const middlewares: MiddlewareFunction[] = [];

export function applyMiddlewares(router: IRouter) {
  const middlewareFiles = readdirSync(join(__dirname, "../middleware"));
  middlewareFiles.forEach((file) => {
    middlewares.push(require(`../middleware/${file}`).default);
  });

  const originalHandle = router.handle;
  
  router.handle = async function (req: Request, res: EnhancedResponse) {
    let i = 0;
    const next = async (): Promise<void> => {
      if (i < middlewares.length) {
        await middlewares[i++](req, res, next);
      } else {
        // Call the original router handle method instead of accessing private routes
        await originalHandle.call(router, req, res);
      }
    };
    next();
  };
}
