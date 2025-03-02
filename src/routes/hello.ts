import { Request, EnhancedResponse, RouteHandler } from '../types';

export default {
    method: "GET",
    url: "/hello",
    handler: async (req: Request, res: EnhancedResponse): Promise<void> => {
      res.json({ message: "Hello, World!" });
    },
  };
  
