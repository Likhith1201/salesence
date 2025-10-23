# Install Backend Dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Green

# Set CI environment variable
$env:CI = "true"

# Run pnpm install
pnpm install

Write-Host ""
Write-Host "Generating Prisma client..." -ForegroundColor Green
pnpm --filter @scraper/db exec prisma generate

Write-Host ""
Write-Host "Installation complete!" -ForegroundColor Green
Write-Host "You can now run 'npm start' from the root directory" -ForegroundColor Yellow
