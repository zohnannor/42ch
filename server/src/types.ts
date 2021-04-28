import { Connection } from 'typeorm';
import { Response, Request } from 'express';

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

export interface Context {
  req: Request;
  res: Response;
  conn: Connection;
}
