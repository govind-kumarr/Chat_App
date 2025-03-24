const { formidable } = require("formidable");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { Upload } = require("@aws-sdk/lib-storage");
const { RegisterModel } = require("../models/Register.model");
const { initializeS3, bucket } = require("../aws/s3");
const axios = require("axios");
const qs = require("qs");
const { store } = require("..");
const { updateElseInsertUser } = require("../services/user.services");
const { createSession } = require("../services/session.services");
const { signJwt } = require("../utils/jwt.utils");
require("dotenv").config();

const app_url = process.env.APP_URL;

const accessTokenCookieOptions = {
  maxAge: 900000, // 15 mins
  httpOnly: true,
  domain: "localhost",
  path: "/",
  sameSite: "lax",
  secure: false,
};

const userRegister = async (req, res) => {
  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.json({
        message: "Error while registering Try Again",
      });
    }
    let { username, password, email } = fields;
    username = username[0];
    password = password[0];
    email = email[0];
    console.log({ files });

    let { image } = files;

    let errors = [];
    if (!username) errors.push("Username must be provided");
    if (!password) errors.push("Password must be provided");
    if (!email) errors.push("Email must be provided");

    if (errors.length > 0) {
      return res.status(400).json({
        error: {
          errorMessage: errors,
        },
      });
    }

    const user = await RegisterModel.find({ username, email });

    if (user.length > 0) {
      return res.json({
        message: "User already registered",
      });
    }

    image = image?.length > 0 ? image[0] : image;
    console.log({ image });

    const fileName = image.originalFilename;
    const randNo = Math.floor(Math.random() * 100000);
    const newFileName = randNo + fileName;
    image.originalFilename = newFileName;

    const fileStream = fs.createReadStream(image.filepath);

    const fileUpload = new Upload({
      client: initializeS3(),
      params: {
        Bucket: bucket,
        Key: `${username}/${image.originalFilename}`,
        Body: fileStream,
      },
    });

    const uploadDetails = await fileUpload.done();
    const pathToPublic = path.resolve(
      __dirname,
      "..",
      "..",
      "Frontend",
      "public",
      newFileName
    );
    fs.copyFile(image.filepath, pathToPublic, async (err) => {
      if (!err) {
        console.log("Copy Action successfull");
        let newUser = new RegisterModel({
          username,
          email,
          password,
          image: image.originalFilename,
          avatarUrl: encodeURI(
            `http://localhost:${port}/api/file/avatar/${uploadDetails.Key}`
          ),
        });

        newUser = await newUser.save();

        //JWT SECRET
        const secret = process.env.SECRET;

        const token = jwt.sign(
          {
            id: newUser._id,
            email: newUser.email,
            userName: newUser.userName,
            image: newUser.image,
            registerTime: newUser.createdAt,
          },
          secret,
          {
            expiresIn: 30,
          }
        );

        const expiresTime = new Date(Date.now() + 30 * 60 * 1000);

        return res
          .status(201)
          .cookie("authToken", token, { expires: expiresTime })
          .json({
            message: "Registration Successful",
            access_token: token,
          });
      }
    });
  });
};

const userLogin = async (req, res) => {
  const form = formidable();
  form.parse(req, async (err, fields) => {
    if (err)
      return (
        res.status(500),
        json({
          message: "Error While loggin in user",
        })
      );

    let { email, password } = fields;
    let errors = [];
    if (!email) errors.push("Please enter a valid email");
    if (!password) errors.push("Please enter a valid password");

    if (errors.length > 0)
      return res.json({
        errors,
      });

    const doesExist = await RegisterModel.findOne({ email }).select(
      "+password"
    );

    if (!doesExist) {
      errors.push(`No user exists with this email address ${email}`);
      return res.json({ errors });
    }

    if (doesExist.password === password) {
      //JWT SECRET
      const secret = process.env.SECRET;

      const token = jwt.sign(
        {
          id: doesExist._id,
          email: doesExist.email,
          username: doesExist.username,
          image: doesExist.image,
          registerTime: doesExist.createdAt,
        },
        secret,
        {
          expiresIn: 30,
        }
      );

      return res.cookie("accessToken", token, accessTokenCookieOptions).json({
        message: "Login successful",
        access_token: token,
      });
    } else {
      errors.push("Invalid password");
      return res.json({ errors });
    }
  });
};

const userLogout = async (req, res) => {
  console.log(req.session.user_id);
  console.log(
    store.all((err, sessions) => {
      if (err) console.log(err);
      else console.log(sessions);
    })
  );
  // store.destroy()
  // req.session.destroy();
  res.send("Successfully logged out");
};

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

const googleAuthHandler = async (req, res) => {
  const code = req.query.code;
  // get id_token and access_token
  const { id_token, access_token } = await getGoogleOAuthTokens({ code });
  // Retrieve user from id_token and access_token
  const googleUser = await getGoogleUser({ id_token, access_token });

  if (!googleUser.verified_email)
    res.status(401).send("Email is not verified!");

  const newUser = {
    username: googleUser.name,
    email: googleUser.email,
    password: "nasjkndfa;slknv;zdj fnvkjz",
    image: googleUser.picture,
    avatarUrl: googleUser.picture,
  };
  // Upsert the user in database
  let insertedUser = await updateElseInsertUser(
    { email: newUser.email },
    newUser
  );
  const session = await createSession(insertedUser._id);

  const accessToken = signJwt(
    {
      email: googleUser.email,
      username: googleUser.name,
      picture: googleUser.picture,
      session: session._id,
    },
    { expiresIn: 900 }
  );

  // set cookies
  res.cookie("accessToken", accessToken, accessTokenCookieOptions);
  // redirect back to client
  res.redirect(app_url);
};

const verifyUser = async (req, res) => {
  return res.json({
    authenticated: true,
  });
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  googleAuthHandler,
  verifyUser,
};
