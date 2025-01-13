const { execSync } = require('child_process');

try {
  execSync('python -c "import fpdf"');
  console.log('Python and FPDF are properly configured');
} catch (error) {
  console.error('Please install Python and FPDF: pip install fpdf');
  process.exit(1);
} 