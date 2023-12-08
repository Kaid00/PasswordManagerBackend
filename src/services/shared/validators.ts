import { PasswordModel } from "../model/passwordModel"


export class JSONError extends Error {
    
}

export class MissingFieldError extends Error {
    constructor(missingField: string) {
        super(`Value for ${missingField} expected`)
    }
}

export function validatePasswordEntry(arg: any) {
    if ((arg as PasswordModel).password == undefined) {
        throw new MissingFieldError('password')
    }
    if ((arg as PasswordModel).username == undefined) {
        throw new MissingFieldError('username')
    }
    if ((arg as PasswordModel).id == undefined) {
        throw new MissingFieldError('id')
    }
    
}