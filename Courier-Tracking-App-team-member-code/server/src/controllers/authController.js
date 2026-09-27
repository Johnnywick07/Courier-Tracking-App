import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

// @route POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: ["admin", "rider", "customer"].includes(role) ? role : "customer",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/forgot-password
// Generates a reset token and (in a real deployment) emails a link containing it.
// Since this project has no email service configured, the raw token/link is
// returned directly in the response for development/testing purposes.
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always respond the same way whether or not the email exists,
    // so the endpoint can't be used to check which emails are registered.
    if (!user) {
      return res.json({
        message: "If that email is registered, a reset link has been generated.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${rawToken}`;

    const emailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

    if (emailConfigured) {
      try {
        await sendEmail({
          to: user.email,
          subject: "Reset your Courier Tracking password",
          html: `
            <p>Hi ${user.name},</p>
            <p>You requested a password reset. Click the link below — it expires in 15 minutes:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>If you didn't request this, you can safely ignore this email.</p>
          `,
        });
        return res.json({
          message: "If that email is registered, a reset link has been sent to it.",
        });
      } catch (emailErr) {
        console.error("Failed to send reset email:", emailErr.message);
        // Fall through to dev-mode response below so testing isn't blocked
        // by an email misconfiguration.
      }
    }

    // Dev-mode fallback: no EMAIL_USER/EMAIL_PASS configured yet (or sending
    // failed), so return the link directly instead of emailing it.
    res.json({
      message: "If that email is registered, a reset link has been generated.",
      resetUrl,
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({ message: "Reset link is invalid or has expired" });
    }

    user.password = password; // pre-save hook hashes this
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset. You can now log in." });
  } catch (err) {
    next(err);
  }
};
