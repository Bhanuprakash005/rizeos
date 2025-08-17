/*
 Purges all DevLink collections. Use carefully.
 Run: npm run db:reset
*/
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI missing in .env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  const conn = await mongoose.connect(uri);
  console.log('Connected:', conn.connection.name);

  // Lazy import models to ensure they are registered
  const User = require('../models/User');
  const Profile = require('../models/Profile');
  const Post = require('../models/Post');
  let Payment;
  try { Payment = require('../models/Payment'); } catch { /* optional */ }

  const ops = [];
  ops.push(User.deleteMany({}));
  ops.push(Profile.deleteMany({}));
  ops.push(Post.deleteMany({}));
  if (Payment) ops.push(Payment.deleteMany({}));

  await Promise.all(ops);
  console.log('Collections cleared: User, Profile, Post' + (Payment ? ', Payment' : ''));

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(async (err) => {
  console.error('Reset failed:', err?.message || err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});


