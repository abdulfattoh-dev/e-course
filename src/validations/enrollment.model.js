import Joi from "joi";

export const enrollmentValidation = (data) => {
    const enrollment = Joi.object({
        courseId: Joi.string().required(),
        userId: Joi.string().required(),
    });

    return enrollment.validate(data);
}
