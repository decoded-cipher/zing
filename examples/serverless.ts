import { createApp, Request, Response } from "zing";
import { awsAdapter } from "zing/adapters";

const app = createApp();

app.get("/hello", async (req: Request, res: Response) => {
  return res.json({ message: "Hello from AWS Lambda!" });
});

export const handler = awsAdapter(app);
