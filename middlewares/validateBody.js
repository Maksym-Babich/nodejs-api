const { object } = require('joi');
const { HttpError } = require('../utils');

const validateBody = (schema) => {
  const func = (req, res, next) => {
    let message = '';
    const { error } = schema.validate(req.body);
    console.log(Object.keys(req.body).length);
    if (Object.keys(req.body).length === 0 && req.method === 'PATCH') {
      message = 'missing field favorite';
      next(HttpError(400, message));
    }
    if (Object.keys(req.body).length === 0) {
      message = 'missing fields';
      next(HttpError(400, message));
    }
    if (error) {
      message = `missing required ${error?.details[0]?.context.label} field`;
      next(HttpError(400, message));
    }

    next();
  };
  return func;
};

module.exports = validateBody;
