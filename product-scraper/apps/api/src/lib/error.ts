import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(public statusCode:number, public code:string, message:string, public details?:unknown){
    super(message);
  }
}

export class ValidationError extends AppError{
  constructor(message:string, details?:unknown){ super(400,'VALIDATION_ERROR',message,details);}
}
export class RobotsDisallowedError extends AppError{
  constructor(message:string){ super(451,'ROBOTS_DISALLOWED',message);}
}
export class BlockedError extends AppError{
  constructor(message:string){ super(502,'SCRAPING_BLOCKED',message);}
}

export function notFoundHandler(req:Request,res:Response){
  res.status(404).json({error:{code:'NOT_FOUND',message:`Route ${req.method} ${req.path} not found`}});
}

export function errorHandler(err:any, req:Request,res:Response,_next:NextFunction){
  if(err instanceof AppError){
    return res.status(err.statusCode).json({error:{code:err.code,message:err.message,details:err.details}});
  }
  return res.status(500).json({error:{code:'INTERNAL',message: err?.message || 'Unexpected error'}});
}
