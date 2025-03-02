import { Server } from "./core/server";

const PORT = process.env.PORT || 3000;
const app = new Server();

app.get("/", (req, res) => {
  res.json({ message: "Hello from ZingJS!" });
});

app.listen(Number(PORT), () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
