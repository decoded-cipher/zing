import { createServer, ServerResponse, Server as HttpServer } from "http";
import { Router } from "./router";
import { applyMiddlewares } from "./middleware";
import { EnhancedResponse, RouteHandler, IRouter, Request } from "../types";

export class Server {
  private router: IRouter;
  private server: HttpServer;

  constructor() {
    this.router = new Router();
    applyMiddlewares(this.router); // Load middleware

    this.server = createServer(async (req: Request, res: ServerResponse) => {
      // Cast res to EnhancedResponse - the Router will add the json method
      await this.router.handle(req, res as EnhancedResponse);
    });
  }
  get(path: string, handler: RouteHandler) {
    this.router.get(path, handler);
  }

  post(path: string, handler: RouteHandler) {
    this.router.post(path, handler);
  }

  put(path: string, handler: RouteHandler) {
    this.router.put(path, handler);
  }

  delete(path: string, handler: RouteHandler) {
    this.router.delete(path, handler);
  }

  listen(port: number, callback: () => void) {
    this.server.listen(port, callback);
    return this.server;
  }
}