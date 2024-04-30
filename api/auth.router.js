import { Router } from "express";
import user from "../DB/models/user.model.js";
import { hash } from "../services/hash.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../services/asyncHandler.js";
import { loginSchema, signupSchema } from "./auth.validation.js";
import { validate } from "./auth.middleware.js";
import { sendEmail } from "../services/email.js";
import { verify } from "../services/verify.js";

const router = Router();

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const userInfo = await user.findOne({ email });
    if (!userInfo) {
      return res.json("email not exists");
    }
    const matchPass = compare(password, userInfo.password);
    const token = jwt.sign({ id: userInfo._id }, process.env.SIGN);
    if (matchPass) {
      res.json(token);
    } else {
      res.json("no password");
    }
  })
);
router.post("/signup", validate(signupSchema), async (req, res) => {
  const { userName, email, password } = req.body;

  const found = await user.findOne({ email });

  if (found) {
    return res.json("exists");
  }
  const hashPass = hash(password);
  const userInfo = await user.create({ userName, password: hashPass, email });
  const token = jwt.sign({email},process.env.SIGN)
  await sendEmail(   //it may be sent in spam
    email,
    "email verification link",
    `<a href="${process.env.VERIFY_EMAIL_LINK}${token}">verify email</a>`
  );
  res.status(201).json(userInfo);
});
router.get("/confirmEmail/:token", async (req, res) => {
  const { token } = req.params;

  const {email} = verify(token)
  if(!email){
    return res.json("invalid token")
  }
  

  const found = await user.findOne({ email });

  if (!found) {
    return res.json("email not found");
  }
  const userInfo = await user.updateOne({email},{confirmEmail: true})
  res.json(userInfo);
});

export default router;




