#!/bin/bash

# Auto-setup script for time-tracker-starter
# Run with: bash setup.sh

set -e

echo "🚀 Starting setup for Time Tracker Starter..."

if ! command -v npm &> /dev/null
then
    echo "❌ npm not found. Please install Node.js before continuing."
    exit
fi

if ! command -v npx &> /dev/null
then
    echo "❌ npx not found. Please install Node.js before continuing."
    exit
fi

if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env from example..."
    cp backend/.env.example backend/.env
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "🗄️  Running Prisma migrations..."
npx prisma migrate dev --name init

echo "🚚 Starting backend server..."
npm run dev &
BACK_PID=$!

cd ..

echo "📦 Installing frontend dependencies..."
cd frontend
npm install

echo "🖥️  Starting frontend server..."
npm run dev &
FRONT_PID=$!

sleep 5

URL="http://localhost:5173"
if which xdg-open > /dev/null
then
  xdg-open $URL
elif which open > /dev/null
then
  open $URL
elif which start > /dev/null
then
  start $URL
fi

echo "✅ Setup complete! Frontend running on $URL"
echo "🔧 Backend and frontend are both running. Press Ctrl+C to stop."

wait $BACK_PID $FRONT_PID
