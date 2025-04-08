const { SessionModel } = require("../models/Session.modal");

const accessTokenCookieOptions = {
  maxAge: 1000 * 24 * 60 * 60, // 1 day
  httpOnly: true,
  domain: "localhost",
  path: "/",
  sameSite: "lax",
  secure: false,
};

const createSession = async (user_id) => {
  const session = await SessionModel.create({ user: user_id });
  return session.toJSON();
};

async function findSessions(query) {
  return SessionModel.find(query).lean();
}

async function updateSession(query, update) {
  return SessionModel.updateOne(query, update);
}

async function reIssueAccessToken({ refreshToken }) {
  const { decoded } = verifyJwt(refreshToken);

  return accessToken;
}

const attachSession = (res, sid) => {
  if (sid) {
    res.cookie("chat_app_sid", sid, accessTokenCookieOptions);
  }
};

module.exports = {
  createSession,
  findSessions,
  updateSession,
  reIssueAccessToken,
  attachSession,
};
