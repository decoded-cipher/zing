declare module 'zing' {
  import { IncomingMessage, ServerResponse } from 'http';

  export interface Request extends IncomingMessage {
    params: Record<string, string>;
    query: Record<string, string>;
    body: any;
  }

  export interface Response extends ServerResponse {
    status(code: number): Response;
    json(data: any): void;
    send(data: string | object | Buffer): void;
  }

  export type NextFunction = (error?: Error) => void;
  
  export type Middleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;

  export type RouteHandler = (
    req: Request,
    res: Response
  ) => void | Promise<void>;

  export interface App {
    use(middleware: Middleware): App;
    get(path: string, handler: RouteHandler | RouteHandler[]): App;
    post(path: string, handler: RouteHandler | RouteHandler[]): App;
    put(path: string, handler: RouteHandler | RouteHandler[]): App;
    delete(path: string, handler: RouteHandler | RouteHandler[]): App;
    listen(port: number, callback?: () => void): void;
  }

  export function createApp(): App;
}

declare module 'zing/adapters' {
  import { App } from 'zing';
  
  export interface AWSEvent {
    httpMethod: string;
    path: string;
    queryStringParameters: Record<string, string> | null;
    headers: Record<string, string>;
    body: string | null;
  }

  export interface AWSResponse {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
  }

  export interface AWSContext {
    [key: string]: any;
  }

  export type AWSHandler = (
    event: AWSEvent,
    context: AWSContext
  ) => Promise<AWSResponse>;

  export function awsAdapter(app: App): AWSHandler;
}

