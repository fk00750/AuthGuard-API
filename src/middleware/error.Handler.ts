import type { ErrorRequestHandler } from "express";
import { ValidationError } from "joi";
import CustomErrorHandler from "../utils/CustomError.Handler";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let data: object;

  if (err instanceof ValidationError) {
    statusCode = 422;
    data = {
      errorMessage: err.message,
    };
  } else if (err instanceof CustomErrorHandler) {
    statusCode = err.status;
    data = {
      errorMessage: err.message,
    };
  } else {
    data = {
      message: "Internal Server Error",
      errorMessage: err.message,
    };
  }

  return res.status(statusCode).json(data);
};

export default errorHandler;
