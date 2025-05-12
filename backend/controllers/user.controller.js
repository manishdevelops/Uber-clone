const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/backlistToken.model');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');


const hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const isUserAlready = await userModel.findOne({ email });

    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exist' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });

}

module.exports.loginUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();

    res.cookie('token', token,
        // {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     maxAge: 3600000
        // }

    );

    res.status(200).json({ token, user });
};

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    await blackListTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out' });
};


exports.forgotPassword = async (req, res) => {
    const { email, frontendUrl } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User no longer exist.' });

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false }); // we manipulated the doc so we need to save;
    // validateBeforeSave: false -> this will deactivate all the validators that we specified in our schema

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASS
        }
    });

    var mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: `${user.email}`,
        subject: 'TaskTracker:Reset Your Password',
        text: `${frontendUrl}/reset-password/${resetToken}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return res.status(500).json({ message: 'There was an error sending the email. Try again later!' });
        } else {
            // console.log('Email sent: ' + info.response);
            return res.status(200).json({
                status: 'success',
                message: 'Token sent to email!'
            });
        }
    });
};

module.exports.resetPassword = async (req, res) => {
    // 1) get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex'); //encrypt again bcz plain token has been sent and encrypted one is stored in the db

    const user = await userModel.findOne(
        {
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() } // behind the scenes mongoDB doing everything
        });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    user.password = await hashPassword(req.body.password);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save(); // now we want to validate so , not used 'validateBeforeSave: false'

    const token = user.generateAuthToken();

    res.cookie('token', token,
        // {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     maxAge: 3600000
        // }

    );

    res.status(201).json({ token, user });
};
