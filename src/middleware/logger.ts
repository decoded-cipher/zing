import { Request, EnhancedResponse, NextFunction } from '../types/index';

export default async function (req: Request, res: EnhancedResponse, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
}
  