import Joi from "joi";

export const reviewValidation = (data) => {
    const review = Joi.object({
        courseId: Joi.string().required(),
        userId: Joi.string().required(),
        rating: Joi.number().valid(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).required(),
        comment: Joi.string().required()
    });

    return review.validate(data);
}
