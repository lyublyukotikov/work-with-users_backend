import { UserAttributes } from '../models/user-model';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserAttributes;
  }
}
export interface Payload {
  id: number;
  email: string;
  role?: 'ADMIN' | 'USER';
}
