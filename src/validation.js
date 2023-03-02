import joi from "joi";

const postSchema = joi.object({
	name: joi.string().min(3).required(),
	population: joi.number().min(1).required(),
	capital: joi.string().min(3).required(),
	language: joi.string().min(3).required()
});

const patchSchema = joi.object({
	name: joi.string().min(3).required(),
	population: joi.number().min(1),
	capital: joi.string().min(3),
	language: joi.string().min(3)
});

export { postSchema, patchSchema };
