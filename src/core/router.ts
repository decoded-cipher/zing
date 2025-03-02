import { ServerResponse } from "http";
import { readdirSync } from "fs";
import { join } from "path";
import { EnhancedResponse, RouteHandler, IRouter, Request } from "../types";

export class Router implements IRouter {
  private routes: Record<string, RouteHandler> = {};

  constructor() {
    this.loadRoutes();
  }

  private loadRoutes() {
    const routeFiles = readdirSync(join(__dirname, "../routes"));
    routeFiles.forEach((file) => {
      const route = require(`../routes/${file}`).default;
      this.routes[`${route.method}-${route.url}`] = route.handler;
    });
  }

  /**
   * Registers a GET route handler
   * @param path The URL path for the route
   * @param handler The function to handle the route
   */
  get(path: string, handler: RouteHandler): void {
    this.routes[`GET-${path}`] = handler;
  }

  /**
   * Registers a POST route handler
   * @param path The URL path for the route
   * @param handler The function to handle the route
   */
  post(path: string, handler: RouteHandler): void {
    this.routes[`POST-${path}`] = handler;
  }

  /**
   * Registers a PUT route handler
   * @param path The URL path for the route
   * @param handler The function to handle the route
   */
  put(path: string, handler: RouteHandler): void {
    this.routes[`PUT-${path}`] = handler;
  }

  /**
   * Registers a DELETE route handler
   * @param path The URL path for the route
   * @param handler The function to handle the route
   */
  delete(path: string, handler: RouteHandler): void {
    this.routes[`DELETE-${path}`] = handler;
  }

  async handle(req: Request, res: ServerResponse): Promise<void> {
    // Enhance the response object with a json method
    const enhancedRes = res as EnhancedResponse;
    enhancedRes.json = function(data: any, statusCode: number = 200) {
      this.writeHead(statusCode, { "Content-Type": "application/json" });
      this.end(JSON.stringify(data));
    };

    const key = `${req.method}-${req.url}`;
    const handler = this.routes[key];
    if (handler) return handler(req, enhancedRes);
    
    enhancedRes.writeHead(404, { "Content-Type": "application/json" });
    enhancedRes.end(JSON.stringify({ error: "Not Found" }));
  }
}
