const { exec } = require('child_process');

console.log('🔄 Running database migrations...');
exec('npx prisma db push --accept-data-loss', (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Migration failed: ${error.message}`);
    process.exit(1);
  }
  if (stderr) console.error(stderr);
  console.log(`✅ Migration output: ${stdout}`);
  console.log('🎉 Database migrations completed!');
});