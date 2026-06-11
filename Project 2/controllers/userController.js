const db = require('../data/users');

// GET /api/users
// Returns all users (passwords excluded)
const getAllUsers = (req, res) => {
  const users = db.getAll();
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
};

// GET /api/users/:id
// Returns a single user by ID
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID must be a number' });
  }

  const user = db.getById(id);
  if (!user) {
    return res.status(404).json({ error: `User with id ${id} not found` });
  }

  res.status(200).json({ success: true, data: user });
};

// POST /api/users/register
// Creates a new user account
const registerUser = (req, res) => {
  const { name, email, password } = req.body;

  // Semantic validation: does this email already exist?
  const existing = db.findByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Email is already registered' });
  }

  // NOTE: In production, hash the password with bcrypt before storing!
  // e.g. const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = db.create({ name: name.trim(), email, password });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: newUser,
  });
};

// POST /api/users/login
// Validates credentials and returns user info
const loginUser = (req, res) => {
  const { email, password } = req.body;

  const user = db.findByEmail(email);

  // Semantic validation: does the user exist and does the password match?
  // NOTE: In production, use bcrypt.compare() here
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { password: _, ...safeUser } = user;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: safeUser,
    // In production: return a JWT token here
    // token: jwt.sign({ id: safeUser.id }, process.env.JWT_SECRET)
  });
};

// POST /api/users/:id/profile
// Updates a user's profile
const updateProfile = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID must be a number' });
  }

  const existing = db.getById(id);
  if (!existing) {
    return res.status(404).json({ error: `User with id ${id} not found` });
  }

  const updated = db.update(id, req.body);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updated,
  });
};

module.exports = { getAllUsers, getUserById, registerUser, loginUser, updateProfile };
