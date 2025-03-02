import { createApp, Request, Response, NextFunction } from "zingjs";
const app = createApp();

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to my API!" });
});

app.listen(4000, () => console.log("🚀 Running on http://localhost:4000"));
