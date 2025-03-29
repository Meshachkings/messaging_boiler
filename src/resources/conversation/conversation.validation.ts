import Joi from 'joi';

export const createConversationSchema = Joi.object({
    userId: Joi.string().hex().length(24).required(),
    recipientId: Joi.string()
        .hex()
        .length(24)
        .required()
        .not(Joi.ref('userId'))
        .messages({
            'any.invalid': 'Cannot create conversation with yourself',
        }),
});
