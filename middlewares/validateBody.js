const { HttpError } = require('../utils');

const validateBody = (schema) => {
  const func = (req, res, next) => {
    let message = '';
    const { error } = schema.validate(req.body);

    if (error) {
      switch (req.method) {
        case 'PUT':
          message = 'missing fields';
          break;
        case 'POST':
          message = `missing required ${error?.details[0]?.context.label} field`;
          break;
        default:
          break;
      }
      next(HttpError(400, message));
    }
    next();
  };
  return func;
};

module.exports = validateBody;
