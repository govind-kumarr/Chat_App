const { formidable } = require("formidable");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { Upload, } = require("@aws-sdk/lib-storage");
const { RegisterModel } = require("../models/Register.model");
const { initializeS3, bucket } = require("../aws/s3");
require("dotenv").config();

const port = process.env.PORT || 3030;

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

    image = image[0];
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
    email = email[0];
    password = password[0];
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

      return res.json({
        message: "Login successful",
        access_token: token,
      });
    } else {
      errors.push("Invalid password");
      return res.json({ errors });
    }
  });
};

module.exports = {
  userRegister,
  userLogin,
};
