import { Request } from "express";

export default class ReqHandler {
  handledRequest: Request;

  constructor(request: Request) {
    this.handledRequest = request;
  }

  handleRequestBody() {
    if (this.handledRequest.body?.["email"]) {
      this.handledRequest.body["email"] = this.handledRequest.body["email"].toLowerCase().trim();
    }

    return this;
  }

  handleRequestQuery() {
    return this;
  }

  get() {
    return this.handledRequest;
  }
}
