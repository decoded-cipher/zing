# ⚡ Zing – The Lightweight, Modular Backend Framework

Zing is a **fast, event-driven, modular** backend framework written in **TypeScript**. Designed for **performance and flexibility**, it works efficiently on **server-based** and **serverless** environments.  

## ✨ Features  

✅ **Blazing Fast** – Minimal overhead, optimized for speed.  
✅ **Modular & Lightweight** – Small footprint, only what you need.  
✅ **Middleware Support** – Simple, Express-like middleware handling.  
✅ **File-Based Routing** – Automatically maps routes from files.  
✅ **Server & Serverless Ready** – Works on AWS Lambda, Vercel, or traditional servers.  
✅ **CLI Tools** – Easy-to-use commands for project setup and management.  
✅ **JSON-First** – Built for **REST APIs**, no GraphQL by default.  

## 🚀 Getting Started  

### Installation  

```sh
npm install -g zing-cli
```

### Create a New Project  

```sh
zing new my-app
cd my-app
npm install
```

### Running the Server  

```sh
npm start
```

Or define a **custom port**:  

```sh
PORT=5000 npm start
```

### Example Usage  

```typescript
import { Server } from 'zing';

const app = new Server();

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Zing!' });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

## 🛠 CLI Commands  

```sh
zing new <project-name>   # Create a new Zing project
zing build                # Build the project
zing start                # Start the server
zing add <module>         # Install additional modules
```

## 📂 Project Structure  

```
my-app/
│── src/
│   ├── routes/
│   │   ├── index.ts   # GET /
│   │   ├── users.ts   # GET /users
│   ├── middlewares/
│   ├── core/
│── tests/
│── .gitignore
│── package.json
│── tsconfig.json
│── README.md
```

## 📜 License  

MIT License © 2025 - Built with ❤️ by the Zing team.

