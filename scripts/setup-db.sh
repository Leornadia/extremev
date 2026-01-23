#!/bin/bash

# Database Setup Script for Extreme V Website
# This script helps set up the PostgreSQL database for local development

set -e

echo "🚀 Extreme V Database Setup"
echo "============================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo "⚠️  Please update DATABASE_URL in .env.local with your database credentials"
    echo ""
fi

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Docker detected!"
    echo ""
    echo "Would you like to start a PostgreSQL container? (y/n)"
    read -r response
    
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        # Check if container already exists
        if docker ps -a | grep -q extremev-postgres; then
            echo "📦 Container 'extremev-postgres' already exists"
            
            # Check if it's running
            if docker ps | grep -q extremev-postgres; then
                echo "✅ Container is already running"
            else
                echo "▶️  Starting existing container..."
                docker start extremev-postgres
                echo "✅ Container started"
            fi
        else
            echo "📦 Creating new PostgreSQL container..."
            docker run --name extremev-postgres \
                -e POSTGRES_PASSWORD=password \
                -e POSTGRES_DB=extremev \
                -p 5432:5432 \
                -d postgres:15
            
            echo "✅ PostgreSQL container created and started"
            echo ""
            echo "📝 Database credentials:"
            echo "   Host: localhost"
            echo "   Port: 5432"
            echo "   Database: extremev"
            echo "   Username: postgres"
            echo "   Password: password"
            echo ""
            echo "🔧 Update your .env.local with:"
            echo '   DATABASE_URL="postgresql://postgres:password@localhost:5432/extremev"'
        fi
        
        # Wait for PostgreSQL to be ready
        echo ""
        echo "⏳ Waiting for PostgreSQL to be ready..."
        sleep 3
    fi
else
    echo "ℹ️  Docker not found. Please ensure PostgreSQL is installed and running."
    echo ""
fi

# Check if DATABASE_URL is set
if grep -q "DATABASE_URL=\"postgresql://" .env.local; then
    echo ""
    echo "🔄 Running Prisma migrations..."
    npx prisma migrate dev --name init
    
    echo ""
    echo "🌱 Seeding database with sample data..."
    npx prisma db seed
    
    echo ""
    echo "✨ Database setup complete!"
    echo ""
    echo "🎉 You can now:"
    echo "   1. Run 'npm run dev' to start the development server"
    echo "   2. Run 'npx prisma studio' to view your database"
    echo ""
else
    echo ""
    echo "⚠️  DATABASE_URL not configured in .env.local"
    echo "   Please update .env.local with your database connection string"
    echo "   Then run: npx prisma migrate dev --name init"
    echo ""
fi
