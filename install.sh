#!/bin/bash

# Gym Management System Installation Script
# This script sets up the complete gym management system

set -e

echo "🏋️  Welcome to Gym Management System Setup!"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) is installed"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL is not installed or not in PATH. Please ensure PostgreSQL is installed and running."
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed."
    exit 1
fi

print_success "npm $(npm -v) is installed"

# Install root dependencies
print_status "Installing root dependencies..."
npm install

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install
print_success "Backend dependencies installed"

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd ../frontend
npm install
cd ..
print_success "Frontend dependencies installed"

# Setup environment files
print_status "Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    print_success "Backend .env file created from template"
    print_warning "Please update backend/.env with your database connection details"
else
    print_warning "Backend .env file already exists, skipping..."
fi

if [ ! -f "frontend/.env" ]; then
    echo "VITE_API_URL=http://localhost:3000/api/v1" > frontend/.env
    print_success "Frontend .env file created"
else
    print_warning "Frontend .env file already exists, skipping..."
fi

# Database setup prompt
echo ""
print_status "Database Setup"
echo "=============="
echo "Before proceeding, please ensure:"
echo "1. PostgreSQL is running"
echo "2. You have created a database (e.g., gym_management)"
echo "3. Updated DATABASE_URL in backend/.env"
echo ""

read -p "Have you completed the database setup? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Running database migrations..."
    cd backend
    
    # Generate Prisma client
    npm run prisma:generate
    print_success "Prisma client generated"
    
    # Run migrations
    npm run prisma:migrate
    print_success "Database migrations completed"
    
    # Optional seeding
    echo ""
    read -p "Would you like to seed the database with sample data? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm run seed
        print_success "Database seeded with sample data"
    fi
    
    cd ..
else
    print_warning "Skipping database setup. Run 'npm run db:setup' manually after configuring your database."
fi

# Installation complete
echo ""
print_success "🎉 Installation completed successfully!"
echo ""
echo "Next steps:"
echo "==========="
echo "1. Configure your database connection in backend/.env"
echo "2. Run database setup: npm run db:setup"
echo "3. Start development servers: npm run dev"
echo ""
echo "URLs:"
echo "- Frontend: http://localhost:5173"
echo "- Backend API: http://localhost:3000"
echo "- API Docs: http://localhost:3000/api/docs"
echo "- Database Studio: npm run db:studio"
echo ""
echo "Default admin login (after seeding):"
echo "- Email: admin@gym.com"
echo "- Password: admin123"
echo ""
print_success "Happy coding! 🚀"