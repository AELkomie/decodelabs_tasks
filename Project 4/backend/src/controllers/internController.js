const prisma = require('../prismaClient');

// CREATE — POST /api/interns
async function createIntern(req, res, next) {
  try {
    const { name, email, role, skills } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'name and email are required.' });
    }
    const intern = await prisma.intern.create({
      data: { name, email, role: role || 'Intern', skills: skills || [] },
    });
    res.status(201).json({ success: true, data: intern });
  } catch (err) { next(err); }
}

// READ ALL — GET /api/interns
async function getAllInterns(req, res, next) {
  try {
    const { search } = req.query;
    const where = search
      ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { role: { contains: search, mode: 'insensitive' } }] }
      : {};
    const interns = await prisma.intern.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, count: interns.length, data: interns });
  } catch (err) { next(err); }
}

// READ ONE — GET /api/interns/:id
async function getInternById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const intern = await prisma.intern.findUnique({ where: { id } });
    if (!intern) return res.status(404).json({ success: false, message: 'Intern not found.' });
    res.json({ success: true, data: intern });
  } catch (err) { next(err); }
}

// UPDATE — PUT /api/interns/:id
async function updateIntern(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const { name, email, role, skills } = req.body;
    const intern = await prisma.intern.update({
      where: { id },
      data: { name, email, role, skills },
    });
    res.json({ success: true, data: intern });
  } catch (err) { next(err); }
}

// DELETE — DELETE /api/interns/:id
async function deleteIntern(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    await prisma.intern.delete({ where: { id } });
    res.json({ success: true, message: `Intern ${id} deleted.` });
  } catch (err) { next(err); }
}

module.exports = { createIntern, getAllInterns, getInternById, updateIntern, deleteIntern };
