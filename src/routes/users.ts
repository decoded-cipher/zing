import { eventBus } from "../core/events";
import { Request, EnhancedResponse, RouteHandler } from '../types';

export default {
  method: "POST",
  url: "/users",
  handler: async (req: Request, res: EnhancedResponse): Promise<void> => {
    const user = { name: "Alice" }; 
    eventBus.emit("user:created", user);
    res.json(user, 201);
  },
};
// Listen for user creation
eventBus.on("user:created", (user) => console.log("New user:", user));
