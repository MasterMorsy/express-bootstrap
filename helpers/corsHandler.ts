import sendResponse from "./sendResponse";
import { NextFunction, Request, Response } from "express";
import { AppcorsProps } from "..";
import ReqHandler from "./reqHandler";

const initialState = {
  allowedDomains: [],
  allowedIPs: [],
  customHeaders: undefined,
  methods: "GET,POST,OPTION,PUT,DELETE,PATCH",
};

function checkCustomHeader(allowedHeaders: { [key: string]: string }[] | undefined, requestHeaders: any): boolean {
  // Check if the request contains any custom headers
  const customHeaders = Object.keys(requestHeaders).filter((header) => header.startsWith("x-"));
  // Check if each custom header matches its expected value from allowedHeaders

  if (!allowedHeaders || !allowedHeaders.length) return true;
  else if (allowedHeaders?.length && customHeaders.length) {
    const isValidCustomHeaders = customHeaders.every((header) => {
      for (const allowedHeader of allowedHeaders) {
        if (allowedHeader[header.toLowerCase()] === requestHeaders[header.toLowerCase()]) {
          return true;
        }
      }
      return false;
    });
    return isValidCustomHeaders;
  }
  return false;
}

function checkAllowedDomain(allowedDomains: string[] = [], domain: string): boolean {
  return allowedDomains.includes(domain) || !allowedDomains.length ? true : false;
}

function checkAllowedIps(allowedIPs: string[] = [], ip: string): boolean {
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

export default function appCors(req: Request, res: Response, next: NextFunction, options: AppcorsProps = initialState) {
  const ip: any = req.headers["x-real-ip"] || req.ip;
  const domain: string = getDomain(req.headers);

  const isAllowedDomain = checkAllowedDomain(options.allowedDomains, domain);
  const isAllowedIP = checkAllowedIps(options.allowedIPs, ip);
  const isAllowedHeaders = checkCustomHeader(options.customHeaders, req.headers);
  const isAllowedMethod = checkRequestMethod(options.methods ?? initialState.methods, req.method);

  req = new ReqHandler(req).handleRequestBody().handleRequestQuery().get();

  if (isAllowedDomain && isAllowedIP && isAllowedMethod && isAllowedHeaders) next();
  else return sendResponse(res, 401);
}
