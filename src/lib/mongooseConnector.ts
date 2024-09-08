import mongoose from "mongoose";
import { IDBConnectionOptions } from "./";

export default function connectDBs(options: IDBConnectionOptions) {
  const uriConnection = options.uri
    ? options.uri
    : options.user
    ? `mongodb://${options.user}:${options.password}@${options.host ?? "127.0.0.1"}:${options.port ?? "27017"}/${options.dbName}`
    : `mongodb://${options.host ?? "127.0.0.1"}:${options.port ?? "27017"}/${options.dbName}`;
  mongoose
    .connect(uriConnection, {
      autoIndex: false,
      autoCreate: false,
      ...options.options,
    })
    .then(() => {
      console.log(
        `DB: ${
          options.uri ? options.uri : `${options.dbName} is connected on host ${options.host ?? "127.0.0.1"} on port ${options.port ?? "27017"}`
        } `
      );
    })
    .catch((err: any) => {
      console.log("----------- DB: Error connection database -----------");
      console.log(err);
    });
}
