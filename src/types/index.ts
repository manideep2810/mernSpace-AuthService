import { Request } from 'express'

export interface UserData {
    firstName: string
    lastName: string
    email: string
    password: string
    role: string
    tenantId?: number
}

export interface UserDataWithoutRole {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface RegisterUserRequest extends Request {
    body: UserData
}

export interface AuthRequest extends Request {
    auth: {
        sub: string
        role: string
        id?: string
    }
}

export type AuthCookie = {
    accessToken: string
    refreshToken: string
}

export interface IRefreshtokenPayload {
    id: string
}

export interface Itenant {
    name: string
    address: string
}

export interface CraeteTenantRequest extends Request {
    body: Itenant
}

export interface CreateUserRequest extends Request {
    body: UserData
}
