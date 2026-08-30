# 🚀 Quick Start Guide

Get the Waste Management Platform up and running in 5 minutes!

## Prerequisites

✅ Node.js 16+ ([Download](https://nodejs.org))
✅ MongoDB 5+ ([Download](https://www.mongodb.com/try/download/community))
✅ Git
✅ Terminal/Command Prompt

---

## Option 1: Local Development (Recommended for Development)

### Step 1: Clone & Navigate
```bash
git clone <your-repo-url>
cd waste-management-website
```

### Step 2: Setup Backend
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/waste-management
JWT_SECRET=your_super_secret_key_change_in_production
```

Start backend:
```bash
npm run dev
```
✅ Backend running at http://localhost:5000

### Step 3: Setup Frontend (New Terminal)
```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` file:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```
✅ Frontend running at http://localhost:3000

### Step 4: Open Application
- Open browser and go to **http://localhost:3000**
- Register a new account
- Watch the magic happen! ✨

---

## Option 2: Docker Deployment (Production-like)

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### Single Command Startup
```bash
cd deployment
docker-compose up -d
```

**That's it!** All services start automatically:
- ✅ MongoDB: localhost:27017
- ✅ Backend API: http://localhost:5000
- ✅ Frontend: http://localhost:3000

### Verify Services
```bash
docker-compose ps
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 🔐 Test Login

Use these test credentials or create your own:

**Admin Account**
- Email: `admin@wasteman.local`
- Password: `Admin@123`

**User Account**
- Email: `user@example.com`
- Password: `User@123`

---

## 📍 Main Pages & Features

### Public Pages
- **Home** - Overview & features
- **Login/Register** - User authentication

### User Dashboard (`/user/dashboard`)
- ✓ View profile
- ✓ Edit personal information
- ✓ Quick access to all features

### Find Bins (`/user/bins`)
- 📍 Search nearby waste bins
- 🔍 Filter by waste type
- 📊 View fill levels
- 🗺️ Get directions

### Vehicle Tracking (`/user/tracking`)
- 🚗 Live vehicle locations
- 📍 Driver information
- 🚕 Fleet status
- ⏱️ Estimated arrival times

### Submit Complaints (`/user/complaints`)
- 📝 Report issues
- 🏷️ Categorize problems
- 🖼️ Upload attachments
- ✅ Track status

### Education (`/education`)
- 📚 Learn waste management
- 🎬 Watch educational videos
- 📖 Read articles
- 👍 Like content

### Admin Dashboard (`/admin/dashboard`)
- 📊 Operations overview
- 📈 Analytics & metrics
- 🎯 KPI tracking
- 📉 Performance charts

---

## 🛠️ Common Commands

### Backend
```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View service logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build

# Remove all volumes and data
docker-compose down -v
```

---

## 🧪 Testing the API

### Using Postman or curl

**Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secure123",
    "phone": "1234567890"
  }'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure123"
  }'
```

**Get All Bins**
```bash
curl http://localhost:5000/api/bins \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Linux/Mac: Find process using port 5000
lsof -i :5000
kill -9 <PID>

# Windows: Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh  # or 'mongo' for older versions

# Start MongoDB (if not running)
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### npm install Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues
```bash
# Restart Docker daemon
docker-compose restart

# Remove and recreate containers
docker-compose down
docker-compose up --build

# Check logs for errors
docker-compose logs backend
```

---

## 📚 Next Steps

1. **Explore Features** - Try all user and admin features
2. **Read Full Docs** - See [docs/COMPLETE_GUIDE.md](../docs/COMPLETE_GUIDE.md)
3. **Check API Docs** - Review API endpoints in README
4. **Customize** - Modify colors, themes, features
5. **Deploy** - Follow production deployment guide

---

## 🎓 Learning Resources

### Key Files to Understand
- Backend entry: `backend/server.js`
- Frontend entry: `frontend/src/App.jsx`
- Database models: `backend/src/models/`
- API routes: `backend/src/routes/`
- React pages: `frontend/src/pages/`

### Architecture Overview
- 3-layer architecture (Presentation, Application, Data)
- REST API + WebSocket
- Role-based access control
- Geospatial database queries

---

## 💡 Tips

✅ **Change JWT Secret** - Update in .env for production
✅ **Enable HTTPS** - Use in production environments
✅ **Monitor Logs** - Check console for errors
✅ **Use Postman** - Test API endpoints easily
✅ **Read Comments** - Code has helpful documentation

---

## 📞 Getting Help

If you encounter issues:
1. Check the [Full Documentation](../docs/COMPLETE_GUIDE.md)
2. Review error messages in console
3. Check Docker logs
4. Try restarting services
5. Clear browser cache

---

## 🎉 You're Ready!

You now have a fully functional waste management platform!

**Next:** Customize it for your needs, then deploy to production.

Happy coding! 🚀

---

**Last Updated:** March 2026
**Version:** 1.0.0
