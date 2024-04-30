import { Router } from "express";
import { auth } from "./auth.middleware.js";
import user from "../DB/models/user.model.js";
import Message from "../DB/models/message.model.js";

const messageRouter = Router();

messageRouter.post("/:receiverId", auth, async (req, res) => {
  const { receiverId } = req.params;
  const {message} = req.body

  const receiver = await user.findById(receiverId);
  if(!receiver){
    return res.status(404).json("invalid receiver id")
  }
  const m = await Message.create({receiverId, message})

  res.json(m)

});


messageRouter.get("/", auth, async (req, res) => {
  const id = req.id
  const messages = await Message.find({receiverId: id})
  return res.json(messages)
});

messageRouter.delete("/:messageId", auth, async (req, res) => {
  const { messageId } = req.params;
  const messages = await Message.findByIdAndDelete(messageId);
  if(!messages){
    return res.status(404).json("message not found")
  }
  return res.json(messages);
});

export default messageRouter;

