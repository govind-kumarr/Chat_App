const { registerSchema } = require("../validators/auth-validators");

const testValidation = async (schema, payload) => {
  const res = await schema.validateSync(payload, {
    abortEarly: false,
  });
  console.log(res);
};
