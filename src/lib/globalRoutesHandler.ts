import { NextFunction, Response, Request } from "express";

const asyncWrapper = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

const globalRoutesHandler = (router: any) => {
  router?.stack.forEach((layer: any) => {
    if (layer.route) {
      layer.route.stack.forEach((routeLayer: any) => {
        routeLayer.handle = asyncWrapper(routeLayer.handle);
      });
    }
  });
  return router;
};

export default globalRoutesHandler;
