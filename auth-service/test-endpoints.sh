#!/bin/bash
echo "=== Auth Service Test Results ==="
echo

echo "✅ Health Check:"
curl -s http://localhost:3001/health | python3 -m json.tool
echo

echo "✅ Service Info:"
curl -s http://localhost:3001/ | python3 -m json.tool
echo

echo "✅ User Registration:"
curl -s -X POST 'http://localhost:3001/api/auth/sign-up/email' \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@cwmlink.com","password":"Demo123456","name":"Demo User"}' | python3 -m json.tool
echo

echo "✅ User Login:"
curl -s -X POST 'http://localhost:3001/api/auth/sign-in/email' \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@cwmlink.com","password":"Demo123456"}' | python3 -m json.tool
