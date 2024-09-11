# express-bootstrap

**express-bootstrap** is a Node.js package that simplifies the process of setting up an Express.js server by automating repetitive configuration tasks. It helps developers quickly start their projects without having to manually configure things like logging, database connections, CORS, and static file serving.

## Objective

The main goal of **express-bootstrap** is to help developers start their projects easily and quickly by reducing the amount of repeatable configurations and installed packages. With just a few lines of configuration, your project is ready to go.

## Features

- **Automatic Database Connection**: Connects to MongoDB using Mongoose with just a database name.
- **Customizable Logging**: Integrates with `morgan` for logging requests with customizable formats and emoji-based status code coloring.
- **CORS Handling**: Customizable CORS options to define allowed domains, IPs, Headers and methods.
- **Helmet Integration**: Adds security middleware with Helmet, configurable and easy to enable or disable.
- **Static File Serving**: Easily serve multiple static folders with different paths.
- **Error Handling**: Built-in error handling middleware.
- **Quick and Easy Setup**: All configurations are provided in one place.

## Installation

```bash
npm install express-bootstrapi
```

or

```bash
yarn add express-bootstrapi
```

## Usage

Here’s a quick guide on how to use the express-bootstrap package to set up your Express.js project.

#### Step 1: Create a Bootstrap File

Create a new file, for example **bootstrap.ts**, and import the express-bootstrap package. Then, provide the necessary options to initialize the app.

```javascript
import appRoutes1 from "../app/routes1";
import appRoutes2 from "../app/routes2";
const bootstrap = require("express-bootstrapi");

bootstrap({
  routes: [appRoutes1,appRoutes2],
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
    customHeaders: ["customer", "authorization"],
    requiredHeaders : [
      {
        "customer-required-header": "value1",
      }
      {
        "customer-required-header2": "value2",
      }
    ],
    allowedIPs: ["127.0.0.1"],
    allowedDomains: ["example.com", "localhost"],
    allowedRoutes?: ['/app'],
    callBack?: yourCallBackFunction()
  },
  urlencoded: {  extended: true,limit: "5mb"},
  compression: { level: -1 },
  helmet: {
    active: true,
  },
  errorsHandler: (errors) => console.log(errors),
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

### CORS options

| Property          | Type       | Description                                                             | Example                                                                       |
| ----------------- | ---------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `methods`         | `String`   | Specifies the HTTP methods that are allowed for cross-origin requests.  | `"get,post,delete,patch,put"`                                                 |
| `customHeaders`   | `Array`    | Custom headers to be added to the CORS Allowed headers request.         | `[ { "custom-token": "tokenHere" } ]`                                         |
| `allowedIPs`      | `Array`    | A list of specific IPs that are allowed to make requests.               | `[ "127.0.0.1" ]`                                                             |
| `allowedDomains`  | `Array`    | A list of domains that are allowed to make requests.                    | `[ "example.com", "localhost" ]`                                              |
| `allowedRoutes`   | `Array`    | A list of paths that are allowed to requests without cors restrictions. | `[ "/app", "/app2" ]`                                                         |
| `requiredHeaders` | `Array`    | A list of required headers that restrct application respond without it. | `[{ "required-header1": "your-value",},{"required-header2": "your-value",},]` |
| `callBack`        | `Function` | A Function to handle extra application features at cors level.          | ``                                                                            |

### Static Folders Options

| Property | Type     | Description                                                              | Example    |
| -------- | -------- | ------------------------------------------------------------------------ | ---------- |
| `path`   | `String` | The URL path where the static folder will be served.                     | `"/"`      |
| `folder` | `String` | The folder name in your project that contains the static files to serve. | `"public"` |

```javascript
staticFolders: [
  {
    path: "/",
    folder: "public",
  },
  {
    path: "/static",
    folder: "static",
  },
];
```

### Database Connection Options

| Property   | Type     | Description                                                                                        | Example                            |
| ---------- | -------- | -------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `uri`      | `String` | The full MongoDB connection URI string. If provided, it will override other connection properties. | `"mongodb://localhost:27017/mydb"` |
| `user`     | `String` | The username for authenticating with MongoDB.                                                      | `"dbUser"`                         |
| `password` | `String` | The password for the MongoDB user.                                                                 | `"dbPassword"`                     |
| `host`     | `String` | The MongoDB server hostname. Defaults to `"127.0.0.1"` if not provided.                            | `"localhost"`                      |
| `port`     | `String` | The MongoDB server port. Defaults to `"27017"` if not provided.                                    | `"27017"`                          |
| `dbName`   | `String` | The name of the MongoDB database.                                                                  | `"myDatabase"`                     |
| `options`  | `Object` | Additional Mongoose-specific connection options, such as `autoIndex` and `autoCreate`.             | `{ useNewUrlParser: true }`        |

#### Example Usage:

```javascript
{
  db: {
    uri: "", // or leave empty to construct from user, password, host, and dbName
    user: "dbUser",
    password: "dbPassword",
    host: "localhost",
    port: "27017",
    dbName: "myDatabase",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  }
}
```

With no auth and localhost configuration

```javascript
{
  db: {
    dbName: "myDatabase",
  }
}
```

### Logger Status Color Codes

| Status Code Range | Color | Description                             |
| ----------------- | ----- | --------------------------------------- |
| `401`             | 🟡    | Yellow icon for Unauthorized (401)      |
| `5xx`             | 🔴    | Red icon for Server errors (5xx)        |
| `402 - 499`       | 🟠    | Orange icon for Client errors (402-499) |
| `200 - 299`       | ✅    | Green icon for Success (2xx)            |

### urlencoded options

> [**urlencoded options:** as express.urlencoded props](https://expressjs.com/en/5x/api.html#express.urlencoded)

### compression options

> [**compression options:** as compress props](https://www.npmjs.com/package/compression)

### helmet options

> [**helmet options:** as helmet props](https://www.npmjs.com/package/helmet)

### Real world exmaples

> [How to use package at simple express project](https://github.com/MasterMorsy/express-bootstrapi/blob/main/examples/simpleConfig.js)

> [How to use bug tracker send by email template](https://github.com/MasterMorsy/express-bootstrapi/blob/main/examples/bugTrackerEmail.js)

> [How to cors handler to implement middleware approach](https://github.com/MasterMorsy/express-bootstrapi/blob/main/examples/corsCallBack.js)
