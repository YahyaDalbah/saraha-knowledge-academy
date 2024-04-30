import jwt from "jsonwebtoken"
export function verify(token, SIGNATURE = process.env.SIGN){
    const data = jwt.verify(token,SIGNATURE)
    return data;
}

