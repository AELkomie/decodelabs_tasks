// In-memory "database" — no real DB needed for Project 2
let users = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'hashed_password_123',
    role: 'admin',
    createdAt: new Date('2026-01-01').toISOString(),
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'hashed_password_456',
    role: 'user',
    createdAt: new Date('2026-01-15').toISOString(),
  },
];

let nextId = 3;

module.exports = {
  getAll: () => users.map(({ password, ...u }) => u), // never expose passwords
  getById: (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
  },
  findByEmail: (email) => users.find((u) => u.email === email),
  create: (data) => {
    const newUser = {
      id: nextId++,
      name: data.name,
      email: data.email,
      password: data.password, // in real app: hash this!
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    const { password, ...safe } = newUser;
    return safe;
  },
  update: (id, data) => {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...data, id };
    const { password, ...safe } = users[index];
    return safe;
  },
};
