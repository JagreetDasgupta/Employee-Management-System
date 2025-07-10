import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Environment Variables Check');
console.log('==============================');

const requiredVars = [
  'MONGODB_URI',
  'JWT_SECRET'
];

const optionalVars = [
  'NODE_ENV',
  'PORT'
];

console.log('\n✅ Required Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`  ❌ ${varName}: MISSING`);
  }
});

console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ${varName}: ${value}`);
  } else {
    console.log(`  ⚠️  ${varName}: Not set (using default)`);
  }
});

console.log('\n🌍 Current Environment:');
console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`  PORT: ${process.env.PORT || 3000}`);

// Check MongoDB URI format
const mongoUri = process.env.MONGODB_URI;
if (mongoUri) {
  if (mongoUri.includes('mongodb+srv://')) {
    console.log('  ✅ MongoDB URI format: Valid (Atlas)');
  } else if (mongoUri.includes('mongodb://')) {
    console.log('  ✅ MongoDB URI format: Valid (Local/Other)');
  } else {
    console.log('  ❌ MongoDB URI format: Invalid');
  }
} else {
  console.log('  ❌ MongoDB URI: Missing');
}

console.log('\n📊 Summary:');
const missingRequired = requiredVars.filter(varName => !process.env[varName]);
if (missingRequired.length === 0) {
  console.log('  ✅ All required variables are set');
} else {
  console.log(`  ❌ Missing ${missingRequired.length} required variable(s): ${missingRequired.join(', ')}`);
} 