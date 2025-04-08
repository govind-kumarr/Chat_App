const { registerSchema } = require("../validators/auth-validators");

const testValidation = async (schema, payload) => {
  const res = await schema.validateSync(payload, {
    abortEarly: false,
  });
  console.log(res);
};

const oneKb = 1024;
const oneMb = 1024 * oneKb;

const oneSec = 1000;
const oneMinute = 60 * oneSec;
const oneHour = 60 * oneMinute;
const oneDay = 60 * oneHour;

const sizeConversions = (size = 0) => {
  let parsedSize = "";
  if (typeof size === "number") {
    if (size >= oneMb) {
      parsedSize = `${(size / oneMb).toFixed(2)}Mb`;
    } else if (size >= oneKb) {
      parsedSize = `${(size / oneKb).toFixed(2)}Kb`;
    } else `${size}b`;
  }
  return parsedSize;
};

const timeConversions = (time = 0) => {
  let parsedTime = "";

  const currentTime = Date.now();
  console.log(time, currentTime);

  if (time > currentTime) return parsedTime;

  const diff = currentTime - time;

  if (typeof time === "number" && diff < oneDay) {
    if (diff >= oneHour) {
      const hours = Math.floor(diff / oneHour);
      parsedTime = `${hours} ${hours > 1 ? "hours" : "hour"} ago`;
    } else if (diff >= oneMinute) {
      const minutes = Math.floor(diff / oneMinute);
      parsedTime = `${minutes} ${minutes > 1 ? "minutes" : "minute"} ago`;
    } else parsedTime = `${diff} ${diff > 1 ? "seconds" : "second"}  ago`;
  }

  return parsedTime;
};

// const curr = Date.now();
// const messageDate = new Date(Date.now() - 5 * oneHour);

// console.log(sizeConversions(227034));
// console.log(timeConversions(messageDate.getTime()));
