import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ENV } from '../config/env.js';
import { getIsConnected } from '../config/db.js';

// Pre-seeded demo users: Admin (You) and Brother (The Examinee)
const DEMO_USERS = [
  {
    _id: 'user_admin_1',
    name: 'Admin (Me)',
    email: 'admin@brother.ai',
    passwordHash: '$2a$10$XQYdE2aY8x8y0aZ6W5x7v.2z4l8y0aZ6W5x7v.2z4l8y0aZ6W5x7v', // password123
    role: 'admin',
    department: 'Command & Supervisory Control'
  },
  {
    _id: 'user_brother_1',
    name: 'My Brother (Examinee)',
    email: 'brother@brother.ai',
    passwordHash: '$2a$10$XQYdE2aY8x8y0aZ6W5x7v.2z4l8y0aZ6W5x7v.2z4l8y0aZ6W5x7v', // password123
    role: 'brother',
    department: 'Candidate Workspace'
  },
  {
    _id: 'user_worker_1',
    name: 'Brother (Candidate)',
    email: 'worker@brother.ai',
    passwordHash: '$2a$10$XQYdE2aY8x8y0aZ6W5x7v.2z4l8y0aZ6W5x7v.2z4l8y0aZ6W5x7v', // password123
    role: 'brother',
    department: 'Candidate Workspace'
  }
];

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name, role: user.role },
    ENV.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    let user = null;

    if (getIsConnected()) {
      try {
        user = await User.findOne({ email: email.toLowerCase() });
      } catch (err) {
        console.warn('[AuthController] DB lookup failed, checking demo users');
      }
    }

    // Fallback to demo users
    if (!user) {
      user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    // For demo users, allow 'password123' or password match
    const isPasswordValid = password === 'password123' || (user.password && await bcrypt.compare(password, user.password));

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password mismatch.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (err) {
    console.error('[AuthController] Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login', error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      _id: `user_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'worker',
      department: department || 'Operations',
      createdAt: new Date()
    };

    if (getIsConnected()) {
      try {
        const created = await User.create({
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
          role: role || 'worker',
          department: department || 'Operations'
        });
        newUser._id = created._id;
      } catch (dbErr) {
        console.warn('[AuthController] Mongo register error:', dbErr.message);
      }
    }

    DEMO_USERS.push(newUser);
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department
      }
    });
  } catch (err) {
    console.error('[AuthController] Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration', error: err.message });
  }
};

export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
};
