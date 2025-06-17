@echo off

:: Abrir backend en nueva ventana
start "Backend" cmd /k "cd backend && npm install && npm start"

:: Abrir frontend en nueva ventana
start "Frontend" cmd /k "cd frontend && pnpm install && pnpm start"
