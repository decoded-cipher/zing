import { createApp, Request, Response } from "zingjs";
import { awsAdapter } from "zingjs/adapters";

const app = createApp();

app.get("/hello", async (req: Request, res: Response) => {
  return res.json({ message: "Hello from AWS Lambda!" });
});

export const handler = awsAdapter(app);
