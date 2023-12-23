const { SessionModel } = require("../models/Session.modal");

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

module.exports = {
  createSession,
  findSessions,
  updateSession,
  reIssueAccessToken,
};
