// Add these to your existing backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Enhanced CORS for OAuth
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3005', 'http://localhost:3004'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/finshield_finance')
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Error:", err));

// Enhanced User Schema with OAuth fields
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String }, // Optional for OAuth users
  profilePicture: { type: String },
  updates: { type: Boolean, default: false },
  terms: { type: Boolean, required: true },
  // OAuth fields
  googleId: { type: String, unique: true, sparse: true },
  facebookId: { type: String, unique: true, sparse: true },
  appleId: { type: String, unique: true, sparse: true },
  authProvider: { 
    type: String, 
    enum: ['local', 'google', 'facebook', 'apple'],
    default: 'local'
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);

// ==================== OAUTH ROUTES ====================

// Google OAuth
app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google token
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );

    const { email, given_name, family_name, picture, sub: googleId } = response.data;

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        firstName: given_name,
        lastName: family_name,
        email,
        googleId,
        profilePicture: picture,
        authProvider: 'google',
        terms: true // Automatically accepted via OAuth
      });
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      status: 'success',
      message: 'Google authentication successful',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture
        },
        token: jwtToken
      }
    });

  } catch (error) {
    console.error('Google OAuth Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Google authentication failed',
      error: error.message
    });
  }
});

// Facebook OAuth
app.post('/api/auth/facebook', async (req, res) => {
  try {
    const { accessToken } = req.body;

    // Verify Facebook token and get user info
    const response = await axios.get(
      `https://graph.facebook.com/me?fields=id,first_name,last_name,email,picture&access_token=${accessToken}`
    );

    const { id: facebookId, first_name, last_name, email, picture } = response.data;

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { facebookId }] });

    if (user) {
      // Update Facebook ID if not set
      if (!user.facebookId) {
        user.facebookId = facebookId;
        user.authProvider = 'facebook';
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        firstName: first_name,
        lastName: last_name,
        email: email || `facebook_${facebookId}@finshield.com`,
        facebookId,
        profilePicture: picture?.data?.url,
        authProvider: 'facebook',
        terms: true
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      status: 'success',
      message: 'Facebook authentication successful',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture
        },
        token
      }
    });

  } catch (error) {
    console.error('Facebook OAuth Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Facebook authentication failed',
      error: error.message
    });
  }
});

// Apple OAuth
app.post('/api/auth/apple', async (req, res) => {
  try {
    const { identityToken, user } = req.body;

    // Decode Apple identity token (simplified - in production use proper verification)
    const decoded = jwt.decode(identityToken);
    const { sub: appleId, email } = decoded;

    // Check if user exists
    let existingUser = await User.findOne({ $or: [{ email }, { appleId }] });

    if (existingUser) {
      // Update Apple ID if not set
      if (!existingUser.appleId) {
        existingUser.appleId = appleId;
        existingUser.authProvider = 'apple';
        await existingUser.save();
      }
    } else {
      // Create new user
      const firstName = user?.name?.firstName || 'Apple';
      const lastName = user?.name?.lastName || 'User';
      
      existingUser = await User.create({
        firstName,
        lastName,
        email: email || `apple_${appleId}@finshield.com`,
        appleId,
        authProvider: 'apple',
        terms: true
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      status: 'success',
      message: 'Apple authentication successful',
      data: {
        user: {
          id: existingUser._id,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          email: existingUser.email
        },
        token
      }
    });

  } catch (error) {
    console.error('Apple OAuth Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Apple authentication failed',
      error: error.message
    });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'FinShield API is running',
    timestamp: new Date().toISOString()
  });
});

// Regular Registration (existing endpoint)
app.post('/api/users/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, updates, terms } = req.body;

    if (!firstName || !lastName || !email || !password || !terms) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Email already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      updates,
      terms,
      authProvider: 'local'
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          updates: user.updates,
          createdAt: user.createdAt
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during registration'
    });
  }
});

// Login (existing endpoint)
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        },
        token
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during login'
    });
  }
});

// Get All Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      status: 'success',
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching users' });
  }
});

// Delete User
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.json({ status: 'success', message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error deleting user' });
  }
});

// Get Stats
app.get('/api/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const subscribedUsers = await User.countDocuments({ updates: true });
    res.json({
      status: 'success',
      data: { totalUsers, subscribedUsers }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching stats' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('=================================');
  console.log('Server running on port ' + PORT);
  console.log('API: http://localhost:' + PORT + '/api');
  console.log('OAuth endpoints enabled');
  console.log('=================================');
});
