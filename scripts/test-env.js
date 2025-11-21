require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

async function test() {
  console.log('--- Environment Variable Check ---');
  const required = [
    'DB',
    'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
    'SECRET_JWT',
    'NEXT_PUBLIC_LEARNING_URL',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET'
  ];

  let missing = [];
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`❌ Missing: ${key}`);
      missing.push(key);
    } else {
      const val = process.env[key];
      // Show a bit of the value to verify it's not empty or "..."
      const display = val.length > 10 ? val.substring(0, 4) + '...' + val.substring(val.length - 4) : val;
      console.log(`✅ ${key}: ${display}`);
      
      if (val === '...' || val.includes('YOUR_KEY_HERE')) {
          console.warn(`   ⚠️  Warning: ${key} seems to have a placeholder value.`);
      }
    }
  }

  if (missing.length > 0) {
    console.error('\nPlease set the missing environment variables in .env');
  } else {
    console.log('\nAll required environment variables are present.');
  }

  console.log('\n--- MongoDB Connection Test ---');
  if (process.env.DB) {
    try {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.DB);
      console.log('✅ MongoDB Connected Successfully!');
      await mongoose.disconnect();
    } catch (err) {
      console.error('❌ MongoDB Connection Failed:', err.message);
    }
  } else {
    console.log('Skipping MongoDB test (DB variable missing).');
  }
}

test();
