#!/bin/bash

# Fixapp Development Setup Script

set -e

echo "🏥 Setting up Fixapp Healthcare Platform..."
echo "========================================"

# Check if required tools are installed
check_dependencies() {
    echo "📋 Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is required but not installed."
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        echo "📦 Installing pnpm..."
        npm install -g pnpm
    fi
    
    if ! command -v docker &> /dev/null; then
        echo "⚠️  Docker is recommended but not found. You can still run without Docker."
    fi
    
    echo "✅ Dependencies checked"
}

# Setup environment files
setup_env() {
    echo "🔧 Setting up environment files..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "📝 Created .env file. Please update with your actual values:"
        echo "   - Supabase URL and keys"
        echo "   - Razorpay credentials"
        echo "   - Admin credentials"
    fi
    
    # Frontend env
    if [ ! -f frontend/.env ]; then
        cat > frontend/.env << EOF
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
EOF
        echo "📝 Created frontend/.env file"
    fi
    
    # Admin env
    if [ ! -f admin/.env ]; then
        cat > admin/.env << EOF
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_BACKEND_URL=http://localhost:4000
EOF
        echo "📝 Created admin/.env file"
    fi
    
    echo "✅ Environment files setup complete"
}

# Install dependencies
install_deps() {
    echo "📦 Installing dependencies..."
    
    echo "   Backend..."
    cd backend && pnpm install && cd ..
    
    echo "   Frontend..."
    cd frontend && pnpm install && cd ..
    
    echo "   Admin..."
    cd admin && pnpm install && cd ..
    
    echo "✅ Dependencies installed"
}

# Setup database with Supabase
setup_database() {
    echo "🗄️  Database setup instructions:"
    echo "   1. Go to https://supabase.com and create a new project"
    echo "   2. Run the SQL scripts in supabase/ folder:"
    echo "      - schema.sql (creates tables and indexes)"
    echo "      - rls-policies.sql (sets up security)"
    echo "   3. Update your .env files with Supabase credentials"
    echo ""
    echo "   Optional: Use Docker for local Redis:"
    echo "   docker run -d -p 6379:6379 redis:alpine"
}

# Start development servers
start_dev() {
    echo "🚀 Starting development servers..."
    echo "   You can run these commands in separate terminals:"
    echo ""
    echo "   Backend:   cd backend && pnpm dev"
    echo "   Frontend:  cd frontend && pnpm dev"
    echo "   Admin:     cd admin && pnpm dev"
    echo "   Redis:     docker run -d -p 6379:6379 redis:alpine"
    echo ""
    echo "   Or use Docker Compose: docker-compose up -d"
}

# Display final instructions
show_instructions() {
    echo ""
    echo "🎉 Fixapp setup complete!"
    echo "========================"
    echo ""
    echo "📱 Access your applications:"
    echo "   Frontend (Patients): http://localhost:3000"
    echo "   Admin Dashboard:     http://localhost:3001"
    echo "   Backend API:         http://localhost:4000"
    echo "   API Health:          http://localhost:4000/health"
    echo ""
    echo "📚 Next steps:"
    echo "   1. Update environment variables in .env files"
    echo "   2. Set up Supabase database using provided SQL scripts"
    echo "   3. Configure Razorpay payment gateway"
    echo "   4. Start development servers"
    echo ""
    echo "📖 Documentation:"
    echo "   - README.md for detailed setup"
    echo "   - /supabase/ folder for database schemas"
    echo "   - /docs/ folder for API documentation"
    echo ""
    echo "Happy coding! 🏥✨"
}

# Main execution
main() {
    check_dependencies
    setup_env
    install_deps
    setup_database
    start_dev
    show_instructions
}

# Run the script
main "$@"