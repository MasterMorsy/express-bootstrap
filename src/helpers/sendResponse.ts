import { Response } from "express";

interface IResponse {
  [key: number]: {
    success: boolean;
    code: number;
    message: string;
  };
}

const types: IResponse = {
  400: {
    success: false,
    code: 400,
    message: "bad request",
  },
  401: {
    success: false,
    code: 401,
    message: "premession denided",
  },
  404: {
    success: false,
    code: 404,
    message: "record not found",
  },
  409: {
    success: false,
    code: 409,
    message: "conflict record already exist",
  },
  500: {
    success: false,
    code: 500,
    message: "something went wrong",
  },
  200: {
    success: true,
    code: 200,
    message: "operation done",
  },
  201: {
    success: true,
    code: 201,
    message: "record updated successfully",
  },
};

export default function sendResponse(res: Response, code: number, data = {}) {
  return res.status(code).json({ ...types[code], ...data });
}
