#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import { Server } from '../core/server';

const args = process.argv.slice(2);
const portArg = args.find(arg => arg.startsWith('--port='));
const PORT = portArg ? Number(portArg.split('=')[1]) : 3000;

const app = new Server();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const command = process.argv[2];
const param = process.argv[3];

if (command === "new") {
  if (!param) {
    console.error("❌ Please provide a project name.");
    process.exit(1);
  }
  fs.mkdirSync(param);
  fs.writeFileSync(path.join(param, "index.ts"), `
    import { createApp } from "zingjs";

    const app = createApp();
    app.get("/", (req, res) => res.json({ message: "Hello, World!" }));

    app.listen(3000);
  `);
  console.log(`✅ Project '${param}' created.`);
}

if (command === "new:route") {
  if (!param) {
    console.error("❌ Please provide a route name.");
    process.exit(1);
  }
  fs.writeFileSync(path.join(process.cwd(), `routes/${param}.ts`), `
    export default (req, res) => res.json({ message: "This is ${param} route." });
  `);
  console.log(`✅ Route '${param}' created.`);
}
