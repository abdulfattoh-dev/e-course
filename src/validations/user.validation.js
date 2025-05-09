import Joi from "joi";

export const userValidation = (data) => {
    const user = Joi.object({
        full_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(20).required()
    });

    return user.validate(data);
}
