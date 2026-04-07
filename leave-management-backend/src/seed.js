require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedUsers = [
  { name: 'Student One', email: 'student@ums.edu', password: 'password123', role: 'Student', department: 'Computer Science' },
  { name: 'Dr. Professor', email: 'professor@ums.edu', password: 'password123', role: 'Professor', department: 'Computer Science' },
  { name: 'Head of Dept', email: 'hod@ums.edu', password: 'password123', role: 'HOD', department: 'Computer Science' },
  { name: 'University Principal', email: 'principal@ums.edu', password: 'password123', role: 'Principal' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');
    
    await User.deleteMany();
    console.log('Cleared existing users.');

    // Create Principal first
    const principal = await User.create(seedUsers[3]);
    
    // Create HOD and map to Principal
    const hod = await User.create({ ...seedUsers[2], approver: principal._id });
    
    // Create Professor and map to HOD
    const professor = await User.create({ ...seedUsers[1], approver: hod._id });
    
    // Create Student and map to Professor
    await User.create({ ...seedUsers[0], approver: professor._id });

    console.log('Database seeded with hierarchical standard accounts!');
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
