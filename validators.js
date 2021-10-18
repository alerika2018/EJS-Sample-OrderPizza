const joi = require("joi");
const validator = require("validator");

const validators = (type, property) => {
  return function (req, res, next) {
    const data = req[property];

    if (type == "order") {
      const pizzaSchema = joi.object({
        date: joi
          .date()
          .required()
          .empty("")
          .custom((value) => {
            if (!validator.isDate(value)) {
              throw new Error();
            } else {
              return value.toISOString();
            }
          })
          .messages({
            "any.required": "Please enter a date.",
            "date.format": "Please insert date in format yyyy-mm-dd.",
            "any.custom": "Please enter a valid date",
          }),
        size: joi
          .string()
          .required()
          .custom((value) => {
            if (
              ["Extra-large", "Large", "Medium", "Small"].includes(
                req.body.size
              ) == false
            ) {
              throw new Error();
            } else {
              return value;
            }
          })
          .messages({
            "any.required": "Please select the size for the pizza",
            "any.custom":
              "Please select an option from extra-large, large, medium or small",
          }),
        Gluten_free: joi.boolean().empty("").default(false),
        toppings: joi
          .array()
          .required()
          .min(2)
          .max(4)
          .custom((value) => {
            return value.map((topping) => {
              if (
                [
                  "Tomato Sauce",
                  "Cheese",
                  "Pepperoni",
                  "Green peppers",
                  "Mushrooms",
                  "Olives",
                ].includes(topping) == false
              ) {
                throw new Error();
              } else {
                return topping;
              }
            });
          })
          .messages({
            "array.min": "You need to select at least 2 toppings",
            "array.max": "You need to select 4 toppings max ",
            "any.required": "Please select at least 2 toppings",
            "any.custom": "Please select toppings from the given list",
          }),
        name: joi.string().empty("").trim().required().min(2).max(20).messages({
          "any.required": "Please enter a name",
          "string.min": "Name must have at least 2 characters",
          "string.max": "Name mustn' have more then 20 characters",
        }),
        mail: joi
          .string()
          .empty("")
          .trim()
          .required()
          .custom((value) => {
            if (!validator.isEmail(value)) {
              throw new Error();
            } else {
              return value;
            }
          })
          .messages({
            "any.required": "Please enter an email address",
            "any.custom": "Please enter a valid email address",
          }),
        rewards: joi
          .number()
          .integer()
          .positive()
          .max(9999)
          .optional()
          .empty("")
          .messages({
            "number.integer": "Rewards number must be between 1 and 9999",
            "number.positive": "Rewards number must be greater than 1",
            "number.max": "Reward number must not be greater than 9999",
          }),
      });

      const { value, error } = pizzaSchema.validate(data, {
        abortEarly: false,
      });

      res.locals.value = value;
      res.locals.error = error;
    } else if (type == "color") {
      const colorSchema = joi.object({
        color: joi
          .string()
          .min(7)
          .max(7)
          .custom((value) => {
            if (!validator.isHexColor(value)) {
              return "#000000";
            } else {
              return value;
            }
          })
          .failover("#5555aa"),
      });

      const { value, error } = colorSchema.validate(data, {
        abortEarly: false,
      });

      res.locals.value = value;
      res.locals.error = error;
    }
    next();
  };
};

exports.validators = validators;
