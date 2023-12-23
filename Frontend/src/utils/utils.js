import { v4 as uuidv4 } from "uuid";

const getUniqueId = () => uuidv4();

function getGoogleOAuthURL() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    redirect_uri: "http://localhost:3030/api/auth/google-auth",
    client_id: "6743320908-fqv0ap9ai83p9nuf0jk1n1hjfv7uk5tj.apps.googleusercontent.com",
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
}


export { getUniqueId ,getGoogleOAuthURL};
