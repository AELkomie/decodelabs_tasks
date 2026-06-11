// Syntactic + Semantic Validation — "The Gatekeeper Rule"

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  // Syntactic: are the fields present and the right type?
  if (!name || typeof name !== 'string') {
    errors.push('name is required and must be a string');
  } else if (name.trim().length < 2) {
    errors.push('name must be at least 2 characters');
  }

  if (!email || typeof email !== 'string') {
    errors.push('email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('email format is invalid');
  }

  if (!password || typeof password !== 'string') {
    errors.push('password is required');
  } else if (password.length < 6) {
    errors.push('password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string') errors.push('email is required');
  if (!password || typeof password !== 'string') errors.push('password is required');

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

const validateUpdate = (req, res, next) => {
  const { name, email } = req.body;
  const errors = [];

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 2) {
      errors.push('name must be a string with at least 2 characters');
    }
  }

  if (email !== undefined) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('email format is invalid');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

module.exports = { validateRegister, validateLogin, validateUpdate };
