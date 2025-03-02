import * as http from "http";
import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { AWSEvent, AWSContext, AWSResponse } from "zingjs/adapters";

// Custom interfaces for serverless environments
export interface ServerlessRequest {
  method: string;
  url: string;
  body?: any;
  headers?: Record<string, string>;
}

export interface ServerlessResponse {
  statusCode: number;
  json: (data: any) => void;
  status: (code: number) => ServerlessResponse;
}

export class App {
  private routes: Record<string, Function> = {};
  private middlewares: Function[] = [];

  get(path: string, handler: Function) {
    this.routes[`GET ${path}`] = handler;
  }

  use(middleware: Function) {
    this.middlewares.push(middleware);
  }

  async handleRequest(req: IncomingMessage | ServerlessRequest, res: ServerResponse | ServerlessResponse) {
    const { pathname } = parse(req.url!, true);
    const key = `${req.method} ${pathname}`;
    
    let index = 0;
    const next = async () => {
      if (index < this.middlewares.length) {
        await this.middlewares[index++](req, res, next);
      } else {
        this.routes[key]?.(req, res);
      }
    };

    next();
  }

  listen(port: number, callback?: Function) {
    const server = http.createServer((req: IncomingMessage, res: ServerResponse) => this.handleRequest(req, res));
    server.listen(port, () => {
      if (callback) callback();
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  }

  export() {
    return async (event: AWSEvent, context: AWSContext): Promise<AWSResponse> => {
      return new Promise((resolve) => {
        const req: ServerlessRequest = {
          method: event.httpMethod,
          url: event.path,
          body: event.body,
          headers: event.headers
        };
        
        const res: ServerlessResponse = {
          statusCode: 200,
          json: (data: any) => resolve({ 
            statusCode: res.statusCode, 
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
          }),
          status(code: number) {
            res.statusCode = code;
            return res;
          }
        };
        
        this.handleRequest(req, res);
      });
    };
  }
}

export const createApp = () => new App();
