import joi from "joi";

export const loginSchema = {
  body: joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  }).required(),
};
export const signupSchema = {
  body: joi
    .object({
      email: joi.string().email().required(),
      password: joi.string().required(),
      cPassword: joi.string().valid(joi.ref('password')).required(),
      userName: joi.string().alphanum().required()
    })
    .required(),
    query: joi.object({
        test: joi.boolean().required()
    }).required()
    
};