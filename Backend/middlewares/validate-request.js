const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema?.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({
      errors: error.errors,
    });
  }
};

module.exports = {
  validateRequest,
};
