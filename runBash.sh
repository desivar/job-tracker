#!/bin/bash

# Navigate to backend and start server
cd backend
npm install
npm run start &  # run in background

# Navigate to frontend and start dev server
cd ../frontend
pnpm install
pnpm start &   # also run in background

# Wait for all background jobs
wait