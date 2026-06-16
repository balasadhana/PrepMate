const bcrypt = require('bcryptjs');

const sadhanaHash = '$2b$10$/CLwAGReGkdR6jHpRfZ5ke/O0TG2PrHQQFek0omq7H6oB.QdzFDWe';
const adminHash = '$2b$10$qemVrClJz1FQuIxxXVPqg.gmlY5LsnxJXkX9.Y2SAX08YIvvCOQ/y';

const candidatePasswords = [
  'Sadhana',
  'Sadhana2004',
  'SadhanaSadhana2004',
  'sadhana',
  'admin',
  'admin123',
  'password',
  '123456',
  '12345678',
  'admin@gmail.com',
  'Sadhana@gmail.com',
  'admin1234'
];

console.log('Testing Sadhana hash:');
for (const pwd of candidatePasswords) {
  if (bcrypt.compareSync(pwd, sadhanaHash)) {
    console.log(`✅ MATCH FOUND for Sadhana: "${pwd}"`);
  }
}

console.log('\nTesting admin hash:');
for (const pwd of candidatePasswords) {
  if (bcrypt.compareSync(pwd, adminHash)) {
    console.log(`✅ MATCH FOUND for admin: "${pwd}"`);
  }
}
