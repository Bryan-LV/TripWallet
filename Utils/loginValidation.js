const Joi = require('@hapi/joi');

const loginValidation = Joi.object({

  username: Joi.string()
    .alphanum()
    .min(5)
    .max(16),

  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required(),
})

module.exports = loginValidation