import sendResponse from "./sendResponse";
import { NextFunction, Request, Response } from "express";
import { AppcorsProps, IIP, IRequiredHeader, IStaticFolder } from ".";
import ReqHandler from "./reqHandler";

const initialState = {
  allowedDomains: [],
  allowedIPs: [],
  customHeaders: [],
  methods: "GET,POST,OPTION,PUT,DELETE,PATCH",
  allowedRoutes: [],
};

function checkRequiredHeader(requiredHeaders: IRequiredHeader[], requestHeaders: { [key: string]: any }) {
  let result = false;

  if (requiredHeaders && requiredHeaders.length) {
    /**
     * 01 - must ensure that all required headers are present
     * 02 - must ensure that all required headers values are matched
     */

    const haveMissingHeaders = requiredHeaders.find((requiredHeader) => {
      let key = Object.keys(requiredHeader)[0];
      return !requestHeaders[key];
    });

    const oneRequiredHeadetNotMatchValue = requiredHeaders.find((requiredHeader) => {
      let key = Object.keys(requiredHeader)[0];
      return requestHeaders[key] != requiredHeader[key];
    });

    if (!haveMissingHeaders && !oneRequiredHeadetNotMatchValue) result = true;
  }

  return result;
}

function checkAllowedDomain(allowedDomains: string[] = [], domain: string): boolean {
  return allowedDomains.includes(domain) || !allowedDomains.length ? true : false;
}

function checkAllowedIps(allowedIPs: string[] = [], ip: IIP = ""): boolean {
  return allowedIPs.includes(ip) || !allowedIPs.length ? true : false;
}

function getDomain(requestHeaders: any): string {
  // Check if the Host header is present in the request
  const hostHeader = requestHeaders["host"];

  // Check if the Origin header is present in the request (for CORS requests)
  const originHeader = requestHeaders["origin"];

  // Extract domain from Host header
  const domainFromHost = hostHeader ? hostHeader.split(":")[0] : null;

  // Extract domain from Origin header
  const domainFromOrigin = originHeader ? new URL(originHeader).hostname : null;

  // Use the domain extracted from Host header if available, otherwise use the one from Origin header
  return domainFromHost || domainFromOrigin;
}

function checkRequestMethod(allowedMethod: string, requestMethod: string) {
  return (
    allowedMethod?.length &&
    allowedMethod
      ?.split(",")
      .map((method: string) => method.toLowerCase())
      .includes(requestMethod.toLowerCase())
  );
}

export default function appCors(
  req: Request,
  res: Response,
  next: NextFunction,
  options: AppcorsProps = initialState,
  staticFolders: IStaticFolder[] = [],
  poweredBy = ""
) {
  const ip: any = req.headers["x-real-ip"] || req.ip;
  const domain = getDomain(req.headers);
  const allowedMethod = options.methods ?? initialState.methods;
  const customHeaders = options.customHeaders || [];
  const requiredHeaders = options.requiredHeaders || [];

  if (options.allowedDomains && options.allowedDomains.includes(domain)) res.header("Access-Control-Allow-Origin", domain);
  if (!options.allowedDomains || !options.allowedDomains.length) res.header("Access-Control-Allow-Origin", "*");

  let allowedHeaders = "Origin, X-Requested-With, Content-Type, Accept, Authorization ";
  if (requiredHeaders && requiredHeaders.length > 0) {
    requiredHeaders.forEach((header) => {
      allowedHeaders += `,${Object.keys(header)[0]} `;
    });
  }
  if (customHeaders && customHeaders.length > 0) {
    customHeaders.forEach((header) => {
      allowedHeaders += `,${header} `;
    });
  }

  res.header("Access-Control-Allow-Headers", allowedHeaders);

  if (poweredBy) res.setHeader("X-Powered-By", poweredBy);

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", allowedMethod);
    return res.status(200).json({});
  }

  const isAllowedDomain = checkAllowedDomain(options.allowedDomains, domain);
  const isAllowedIP = checkAllowedIps(options.allowedIPs, ip);
  const isRequiredHeadersExist = checkRequiredHeader(requiredHeaders, req.headers);
  const isAllowedMethod = checkRequestMethod(options.methods ?? initialState.methods, req.method);
  let isAllowedRoute = false;
  let allowedRoutes = options.allowedRoutes ?? [];

  if (staticFolders && staticFolders.length) {
    staticFolders.map((staticFolder) => allowedRoutes.push(staticFolder.path));
  }

  if (options.allowedRoutes && options.allowedRoutes.length) {
    isAllowedRoute = options.allowedRoutes.some((route) => req.url.includes(route));
  }

  req = new ReqHandler(req).handleRequestBody().handleRequestQuery().get();

  if ((isAllowedDomain && isAllowedIP && isAllowedMethod && isRequiredHeadersExist) || isAllowedRoute) {
    if (options.callBack) options.callBack(req, res, next);
    else next();
  } else return sendResponse(res, 401);
}
