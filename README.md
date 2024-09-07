# express-bootstrap

**express-bootstrap** is a Node.js package that simplifies the process of setting up an Express.js server by automating repetitive configuration tasks. It helps developers quickly start their projects without having to manually configure things like logging, database connections, CORS, and static file serving.

## Objective

The main goal of **express-bootstrap** is to help developers start their projects easily and quickly by reducing the amount of repeatable configurations and installed packages. With just a few lines of configuration, your project is ready to go.

## Features

- **Automatic Database Connection**: Connects to MongoDB using Mongoose with just a database name.
- **Customizable Logging**: Integrates with `morgan` for logging requests with customizable formats and emoji-based status code coloring.
- **CORS Handling**: Customizable CORS options to define allowed domains, IPs, and methods.
- **Helmet Integration**: Adds security middleware with Helmet, configurable and easy to enable or disable.
- **Static File Serving**: Easily serve multiple static folders with different paths.
- **Error Handling**: Built-in error handling middleware.
- **Quick and Easy Setup**: All configurations are provided in one place.

## Installation

```bash
npm install express-bootstrap
```

or

```bash
yarn add express-bootstrap
```

## Usage

Here’s a quick guide on how to use the express-bootstrap package to set up your Express.js project.

#### Step 1: Create a Bootstrap File

Create a new file, for example **bootstrap.ts**, and import the express-bootstrap package. Then, provide the necessary options to initialize the app.

```javascript
import appRoutes from "../app/routes";
import bootstrap from "express-bootstrap";

bootstrap({
  routes: appRoutes,
  staticFolders: [
    {
      path: "/",
      folder: "public",
    },
    {
      path: "/static",
      folder: "static",
    },
  ],
  db: { dbName: "myDatabase" },
  cors: {
    methods: "get,post,delete,patch,put",
    customHeaders: [],
    allowedIPs: ["127.0.0.1"],
    allowedDomains: ["example.com", "localhost"],
  },
  helmet: {
    active: true,
  },
  loggerFormat: ":remote-addr 🔗 :method ➡️ :url :status :status-color ⏱️ :response-time ms",
  port: 3000,
});
```

#### Step 2: Define Your Routes

In your routes file (e.g., app/routes.ts), define your application routes.

```javascript
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default router;
```

### Step 3: Run the App

You can now run your app and the server will start with the configurations provided.

```bash
node bootstrap.js
```
