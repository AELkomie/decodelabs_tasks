const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.intern.deleteMany();
  console.log('🌱 Seeding interns...');

  const interns = [
    { name: 'Alice Johnson',   email: 'alice@decodelabs.tech',  role: 'Frontend Dev', skills: ['HTML', 'CSS', 'React'] },
    { name: 'Bob Smith',       email: 'bob@decodelabs.tech',    role: 'Backend Dev',  skills: ['Node.js', 'PostgreSQL', 'Prisma'] },
    { name: 'Carol Williams',  email: 'carol@decodelabs.tech',  role: 'Full Stack',   skills: ['React', 'Express', 'MongoDB'] },
    { name: 'David Lee',       email: 'david@decodelabs.tech',  role: 'Intern',       skills: ['JavaScript', 'Python'] },
  ];

  for (const intern of interns) {
    await prisma.intern.create({ data: intern });
  }
  console.log(`✅ Seeded ${interns.length} interns!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
