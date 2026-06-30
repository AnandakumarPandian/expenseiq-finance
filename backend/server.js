// Complete backend/server.js with Expenses Management

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Enhanced CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3005', 'http://localhost:3004', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expenseiq_finance')
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Error:", err));

// ==================== SCHEMAS ====================

// User Schema
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  profilePicture: { type: String },
  updates: { type: Boolean, default: false },
  terms: { type: Boolean, required: true },
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

// Expense Schema
const ExpenseSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  description: { 
    type: String, 
    required: true,
    trim: true
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  category: { 
    type: String, 
    required: true,
    trim: true,
    default: 'other'
  },
  excelCategory: {
    type: String,
    trim: true,
    default: ''
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  notes: { 
    type: String,
    trim: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt timestamp on save
ExpenseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Budget Schema
const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    default: 'other'
  },
  categoryLabel: {
    type: String,
    trim: true,
    default: ''
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  period: {
    type: String,
    required: true,
    enum: ['weekly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

BudgetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model("User", UserSchema);
const Expense = mongoose.model("Expense", ExpenseSchema);
const Budget = mongoose.model("Budget", BudgetSchema);

// ==================== MIDDLEWARE ====================

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

// ==================== EXPENSE ROUTES ====================

// Get all expenses for authenticated user
app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId })
      .sort({ date: -1, createdAt: -1 });
    
    res.json(expenses);
  } catch (error) {
    console.error('Get Expenses Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching expenses',
      error: error.message
    });
  }
});

// Get single expense
app.get('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!expense) {
      return res.status(404).json({
        status: 'error',
        message: 'Expense not found'
      });
    }

    res.json(expense);
  } catch (error) {
    console.error('Get Expense Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching expense',
      error: error.message
    });
  }
});

// Create new expense
app.post('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const { description, amount, category, date, notes, excelCategory } = req.body;

    // Validation
    if (!description || !amount || !category || !date) {
      return res.status(400).json({
        status: 'error',
        message: 'Description, amount, category, and date are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Amount must be greater than 0'
      });
    }

    const expense = await Expense.create({
      userId: req.user.userId,
      description,
      amount: parseFloat(amount),
      category,
      excelCategory: excelCategory || '',
      date: new Date(date),
      notes: notes || ''
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Create Expense Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating expense',
      error: error.message
    });
  }
});

// Update expense
app.put('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const { description, amount, category, date, notes, excelCategory } = req.body;

    // Find and verify ownership
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!expense) {
      return res.status(404).json({
        status: 'error',
        message: 'Expense not found'
      });
    }

    // Update fields
    if (description !== undefined) expense.description = description;
    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Amount must be greater than 0'
        });
      }
      expense.amount = parseFloat(amount);
    }
    if (category !== undefined) expense.category = category;
    if (excelCategory !== undefined) expense.excelCategory = excelCategory;
    if (date !== undefined) expense.date = new Date(date);
    if (notes !== undefined) expense.notes = notes;

    await expense.save();

    res.json(expense);
  } catch (error) {
    console.error('Update Expense Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating expense',
      error: error.message
    });
  }
});

// Delete expense
app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!expense) {
      return res.status(404).json({
        status: 'error',
        message: 'Expense not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    console.error('Delete Expense Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting expense',
      error: error.message
    });
  }
});

// Get expense statistics
app.get('/api/expenses/stats/summary', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    
    // Build query
    const query = { userId: req.user.userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }

    const expenses = await Expense.find(query);
    
    // Calculate statistics
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const count = expenses.length;
    const average = count > 0 ? total / count : 0;
    
    // Category breakdown
    const byCategory = {};
    expenses.forEach(exp => {
      if (!byCategory[exp.category]) {
        byCategory[exp.category] = 0;
      }
      byCategory[exp.category] += exp.amount;
    });

    res.json({
      total,
      count,
      average,
      byCategory
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// ==================== BUDGET ROUTES ====================

// Get all budgets for authenticated user
app.get('/api/budgets', authenticateToken, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(budgets);
  } catch (error) {
    console.error('Get Budgets Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching budgets',
      error: error.message
    });
  }
});

// Create new budget
app.post('/api/budgets', authenticateToken, async (req, res) => {
  try {
    const { category, categoryLabel, amount, period } = req.body;

    if (!category || !amount || !period) {
      return res.status(400).json({
        status: 'error',
        message: 'Category, amount, and period are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Amount must be greater than 0'
      });
    }

    const budget = await Budget.create({
      userId: req.user.userId,
      category,
      categoryLabel: categoryLabel || '',
      amount: parseFloat(amount),
      period
    });

    res.status(201).json(budget);
  } catch (error) {
    console.error('Create Budget Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating budget',
      error: error.message
    });
  }
});

// Update budget
app.put('/api/budgets/:id', authenticateToken, async (req, res) => {
  try {
    const { category, categoryLabel, amount, period } = req.body;

    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!budget) {
      return res.status(404).json({
        status: 'error',
        message: 'Budget not found'
      });
    }

    if (category !== undefined) budget.category = category;
    if (categoryLabel !== undefined) budget.categoryLabel = categoryLabel;
    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Amount must be greater than 0'
        });
      }
      budget.amount = parseFloat(amount);
    }
    if (period !== undefined) budget.period = period;

    await budget.save();

    res.json(budget);
  } catch (error) {
    console.error('Update Budget Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating budget',
      error: error.message
    });
  }
});

// Delete budget
app.delete('/api/budgets/:id', authenticateToken, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!budget) {
      return res.status(404).json({
        status: 'error',
        message: 'Budget not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    console.error('Delete Budget Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting budget',
      error: error.message
    });
  }
});

// ==================== OAUTH ROUTES ====================

// Google OAuth
app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;

    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );

    const { email, given_name, family_name, picture, sub: googleId } = response.data;

    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        await user.save();
      }
    } else {
      user = await User.create({
        firstName: given_name,
        lastName: family_name,
        email,
        googleId,
        profilePicture: picture,
        authProvider: 'google',
        terms: true
      });
    }

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

    const response = await axios.get(
      `https://graph.facebook.com/me?fields=id,first_name,last_name,email,picture&access_token=${accessToken}`
    );

    const { id: facebookId, first_name, last_name, email, picture } = response.data;

    let user = await User.findOne({ $or: [{ email }, { facebookId }] });

    if (user) {
      if (!user.facebookId) {
        user.facebookId = facebookId;
        user.authProvider = 'facebook';
        await user.save();
      }
    } else {
      user = await User.create({
        firstName: first_name,
        lastName: last_name,
        email: email || `facebook_${facebookId}@expenseiq.com`,
        facebookId,
        profilePicture: picture?.data?.url,
        authProvider: 'facebook',
        terms: true
      });
    }

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

    const decoded = jwt.decode(identityToken);
    const { sub: appleId, email } = decoded;

    let existingUser = await User.findOne({ $or: [{ email }, { appleId }] });

    if (existingUser) {
      if (!existingUser.appleId) {
        existingUser.appleId = appleId;
        existingUser.authProvider = 'apple';
        await existingUser.save();
      }
    } else {
      const firstName = user?.name?.firstName || 'Apple';
      const lastName = user?.name?.lastName || 'User';
      
      existingUser = await User.create({
        firstName,
        lastName,
        email: email || `apple_${appleId}@expenseiq.com`,
        appleId,
        authProvider: 'apple',
        terms: true
      });
    }

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

// ==================== USER ROUTES ====================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'ExpenseIQ API is running',
    timestamp: new Date().toISOString()
  });
});

// Register
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

// Login
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
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('=================================');
  console.log('ExpenseIQ API Server');
  console.log('=================================');
  console.log('Server: http://localhost:' + PORT);
  console.log('Health: http://localhost:' + PORT + '/api/health');
  console.log('');
  console.log('Available Endpoints:');
  console.log('- POST /api/users/register');
  console.log('- POST /api/users/login');
  console.log('- GET  /api/expenses');
  console.log('- POST /api/expenses');
  console.log('- PUT  /api/expenses/:id');
  console.log('- DELETE /api/expenses/:id');
  console.log('- GET  /api/budgets');
  console.log('- POST /api/budgets');
  console.log('- PUT  /api/budgets/:id');
  console.log('- DELETE /api/budgets/:id');
  console.log('=================================');
});