const Conversation = require("../model/conversation");
const express = require("express");
const router = express.Router();

router.post(
  "/create-new-conversation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { userId, otherUserId } = req.body;

      const existingConversation = await Conversation.findOne({
        members: { $all: [userId, otherUserId] },
      });

      if (existingConversation) {
        return res.status(200).json({
          success: true,
          conversation: existingConversation,
        });
      }

      const newConversation = await Conversation.create({
        members: [userId, otherUserId],
      });

      res.status(201).json({
        success: true,
        conversation: newConversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
router.get(
  "/get-all-conversation-user/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.params.id;
      const conversations = await Conversation.find({
        members: { $in: [userId] },
      }).sort({ updatedAt: -1, createdAt: -1 });

      res.status(200).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
