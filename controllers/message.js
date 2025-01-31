const Messages = require("../model/messages");
const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const router = express.Router();

router.post(
  "/create-new-message",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { conversationId, sender, text, images } = req.body;

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return next(new ErrorHandler("Conversation not found", 404));
      }

      if (conversation.members.length !== 2) {
        return next(
          new ErrorHandler("This conversation is not a one-on-one chat", 400)
        );
      }

      if (!conversation.members.includes(sender)) {
        return next(
          new ErrorHandler("Sender is not part of this conversation", 403)
        );
      }

      let messageImages = images ? images : undefined;

      const message = new Messages({
        conversationId,
        sender,
        text,
        images: messageImages,
      });

      await message.save();

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
