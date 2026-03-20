@echo off
REM Start frontend dev server
cd /d "c:\Users\Formation\Desktop\forest-3d\parfum-marketplace\frontend"
echo Current directory: %CD%
echo Running npm run dev...
setlocal enabledelayedexpansion
npm run dev
