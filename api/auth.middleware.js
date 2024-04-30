import user from "../DB/models/user.model.js";
import { verify } from "../services/verify.js";

export async function auth(req, res, next) {
  const { token } = req.headers;
  if (!token.startsWith(process.env.BEARER)) {
    return res.json("invalid bearer key");
  }
  const ttoken = token.split(process.env.BEARER)[1];
  const { id } = verify(ttoken);
  const authUser = await user.findById(id);
  if(!authUser){
    return res.json("auth function: user id not registerd")
  }
  req.id = id;
  next();
}

const dataMethods = ['body','query']

export function validate(schema){
  return (req,res,next) => {
    dataMethods.forEach(method => {
      if(schema[method]){
        const validationRes = schema[method].validate(req[method], {
          abortEarly: false,
        });
        if (validationRes.error) {
          return res.status(500).json(validationRes.error);
        }
      }
      
    })
    next();
    
  }
}
