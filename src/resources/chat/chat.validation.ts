import Joi from "joi";


export const createMessageSchema = Joi.object({
    conversationId: Joi.string().required().messages({
      'string.empty': 'Conversation ID is required',
    }),
    senderId: Joi.string().required().messages({
      'string.empty': 'Sender ID is required',
    }),
    text: Joi.string().allow('').optional(),
    attachment: Joi.object().optional(),
}).or('text', 'attachment').messages({
  'object.missing': 'Either text or attachment must be provided',
});
