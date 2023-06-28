const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');
const { nanoid } = require('nanoid');
const { User } = require('../models/user');
const { HttpError, CtrlWrapper, resizeImage, sendMail } = require('../utils');

const { SECRET, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, 'Email in use');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({ ...req.body, password: hashedPassword, avatarURL, verificationToken });
  const verificationEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click here</a>`,
  };
  await sendMail(verificationEmail);

  res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription } });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, 'User not found');
  }
  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

  res.status(200).json({ message: 'Verification successful' });
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, 'Email not found');
  }
  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed');
  }

  const verificationEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click here</a>`,
  };

  await sendMail(verificationEmail);

  res.status(200).json({ message: 'Email send successfully' });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, 'Email or password invalid');
  }

  if (!user.verify) {
    throw HttpError(401, 'Email is not verified');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = { id: user._id };
  console.log(SECRET);

  const token = jwt.sign(payload, SECRET, { expiresIn: '23h' });

  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({ token, user: { email, subscription: user.subscription } });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });
  res.status(204).send();
};

const updateSub = async (req, res) => {
  const { subscription } = req.body;
  const { _id } = req.user;
  if (subscription === req.user.subscription) {
    throw HttpError(409, 'Subscription type can not be the same');
  }
  await User.findByIdAndUpdate(_id, { subscription });

  res.status(200).json({ message: 'Subscription updated' });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const fileName = `${_id}${originalname}`;
  const resultUpload = path.join(avatarsDir, fileName);
  await fs.rename(tempUpload, resultUpload);
  resizeImage(resultUpload);
  const avatarURL = path.join('avatars', fileName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({ avatarURL });
};

module.exports = {
  register: CtrlWrapper(register),
  verifyEmail: CtrlWrapper(verifyEmail),
  resendVerificationEmail: CtrlWrapper(resendVerificationEmail),
  login: CtrlWrapper(login),
  getCurrent: CtrlWrapper(getCurrent),
  logout: CtrlWrapper(logout),
  updateSub: CtrlWrapper(updateSub),
  updateAvatar: CtrlWrapper(updateAvatar),
};
