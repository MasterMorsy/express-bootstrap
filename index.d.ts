export interface AppErrorResponseTypes {
  error: {
    message: string;
    status: number;
    stack: any;
  };
}

export interface IDBConnectionOptions {
  dbName: string;
  port?: string;
  user?: string;
  password?: string;
  host?: string;
  uri?: string;
  options?: {
    [key: string]: any;
  };
}

export interface IBootstrapOptions {
  port?: number;
  name?: string;
  staticFolders?: IStaticFolder[];
  cors?: AppcorsProps;
  helmet?: {
    active: boolean;
    options?: any;
  };
  loggerFormat?: string;
  routes: any;
  db: IDBConnectionOptions;
}

export interface AppcorsProps {
  allowedDomains?: string[];
  allowedIPs?: string[];
  customHeaders?: { [key: string]: any }[];
  methods?: string;
}

export type IStaticFolder = {
  folder: string;
  path: string;
};

export type IControllerMethods = "list" | "get" | "edit" | "create" | "update" | "delete";
