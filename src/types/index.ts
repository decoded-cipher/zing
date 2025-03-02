import { IncomingMessage, ServerResponse } from 'http';

/**
 * Enhanced version of the IncomingMessage with additional properties
 */
export interface Request extends IncomingMessage {
  /**
   * The HTTP method of the request
   */
  method?: string;
  
  /**
   * The URL of the request
   */
  url?: string;
}

/**
 * Enhanced version of ServerResponse with additional utility methods
 */
export interface EnhancedResponse extends ServerResponse {
  /**
   * Sends a JSON response with appropriate headers
   * @param data The data to be JSON-serialized and sent
   * @param statusCode HTTP status code to send (defaults to 200)
   */
  json(data: any, statusCode?: number): void;
}
/**
 * Route handler function type definition
 */
export type RouteHandler = (
  req: Request, 
  res: EnhancedResponse
) => Promise<void> | void;

/**
/**
 * Next function that can be called to continue to the next middleware
 */
export type NextFunction = () => Promise<void> | void;

/**
 * Middleware function type definition
 */
export type MiddlewareFunction = (
  req: Request,
  res: EnhancedResponse,
  next: NextFunction
) => Promise<void> | void;
/**
 * Router interface defining the basic routing methods
 */
export interface IRouter {
  get(path: string, handler: RouteHandler): void;
  post(path: string, handler: RouteHandler): void;
  put(path: string, handler: RouteHandler): void;
  delete(path: string, handler: RouteHandler): void;
  handle(req: Request, res: EnhancedResponse): Promise<void>;
}

