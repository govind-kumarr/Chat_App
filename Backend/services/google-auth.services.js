require("dotenv").config();
const axios = require("axios");
const qs = require("qs");


async function getGoogleOAuthTokens({ code }) {
  const url = "https://oauth2.googleapis.com/token";

  const client_id = process.env.GOOGLE_CLIENT_ID;
  const client_secret = process.env.GOOGLE_CLIENT_SECRET;
  const redirect_uri = process.env.GOOGLE_REDIRECT_URI;

  const values = {
    code,
    client_id,
    client_secret,
    redirect_uri,
    grant_type: "authorization_code",
  };

  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

async function getGoogleUser({ id_token, access_token }) {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error.response.data);
    throw new Error(error.message);
  }
}

module.exports = {
  getGoogleOAuthTokens,
  getGoogleUser,
};
