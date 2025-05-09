import Joi from "joi";

export const courseValidation = (data) => {
    const course = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        categoryId: Joi.string().required(),
        authorId: Joi.string().required()
    });

    return course.validate(data);
}
