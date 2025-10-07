#!/bin/bash

# Service startup script for Airbnb application
set -e

echo "Starting Airbnb services..."

# Function to check if port is in use
port_in_use() {
    nc -z localhost "$1" 2>/dev/null
}

# Start backend if not already running
if ! port_in_use 3000; then
    echo "Starting backend server on port 3000..."
    cd /app/backend
    nohup npm run start:prod > backend.log 2>&1 &
    sleep 5
    if port_in_use 3000; then
        echo "✅ Backend server started successfully"
    else
        echo "❌ Failed to start backend server"
        exit 1
    fi
else
    echo "✅ Backend server already running on port 3000"
fi

# Build and start frontend if not already running
if ! port_in_use 4173; then
    echo "Building and starting frontend server on port 4173..."
    cd /app/vitereact
    npm run build
    nohup npm run preview > frontend.log 2>&1 &
    sleep 3
    if port_in_use 4173; then
        echo "✅ Frontend server started successfully"
    else
        echo "❌ Failed to start frontend server"
        exit 1
    fi
else
    echo "✅ Frontend server already running on port 4173"
fi

echo "✅ All services are running"
echo "Backend API: http://localhost:3000"
echo "Frontend: http://localhost:4173"