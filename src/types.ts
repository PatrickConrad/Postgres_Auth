import {Request} from 'express';

export type ReqUser = {email: string, user_id: string, is_admin: string, first_name: string, last_name: string}

export interface AuthRequest extends Request {
    user: ReqUser
}




export interface CookieOptions {
    expires: Date,
    secure: boolean,
    httpOnly: boolean,
    sameSite: 'Lax'|'None'|'Strict'
}