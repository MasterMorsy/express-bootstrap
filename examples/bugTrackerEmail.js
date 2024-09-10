const express = require("express");
const app = express();
const appRoutes = require("./routes");
const bootstrap = require("express-bootstrapi");
const bugTracker = require("./helpers/bugTracker");

bootstrap({
  routes: [appRoutes],
  staticFolders: [
    {
      path: "/uploads",
      folder: "uploads",
    },
  ],
  db: {
    uri: process.env.DB_URI,
    options: {},
  },
  cors: {
    methods: "GET,POST,DELETE,PATCH,PUT",
    requiredHeaders: [
      {
        "app-token": "your-value",
      },
      {
        "app-token2": "your-value",
      },
    ],
    customHeaders: ["customer"],
    allowedIPs: [],
    allowedDomains: [],
    allowedRoutes: ["sitemap.xml"],
  },
  helmet: {
    active: false,
  },
  urlencoded: {
    extended: true,
    limit: "250kb",
  },
  errorsHandler: bugTracker,
  port: 4000,
});

module.exports = app;
