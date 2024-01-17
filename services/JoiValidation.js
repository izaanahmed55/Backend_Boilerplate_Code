import Joi from "joi";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
export const userRegisterSchema = Joi.object({
    username: Joi.string().max(30).required(),
    firstName: Joi.string().max(30).required(),
    lastName: Joi.string().max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const userLoginSchema = Joi.object({
    email: Joi.string().min(5).max(30).required(),
    password: Joi.string(),
});
