import { NextFunction, Request, Response } from "express";

/**
 * @type RouteParamsHandler
 * @description RouteParamsHandler is a function type that is used to handle the route parameters in an express app.It is used to handle incoming HTTP requests to your express application.
 *@param {Request} req - Express Request object which contains the incoming request.
 *@param {Response} res - Express Response object which is used to send a response back to the client.
 *@param {NextFunction} next - Express NextFunction is used to call the next middleware or route handler in the chain.
 */

type RouteParamsHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export default RouteParamsHandler;
