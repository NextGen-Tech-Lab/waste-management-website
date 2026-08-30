# EcoManage - Waste Management System - Setup & Deployment Guide

## 🌍 Project Overview

EcoManage is a **professional enterprise-grade waste management system** built with:
- **Frontend**: React + Material-UI (Professional Modern Design)
- **Backend**: Node.js + Express (Scalable REST API)
- **Database**: MongoDB (Free cloud via Atlas or local)
- **Real-time Features**: Socket.io for live tracking

---

## 📋 Quick Start (5 Minutes)

### Prerequisites:
- Node.js v18+ (already installed ✓)
- MongoDB (Atlas Cloud or Local - See below)
- VS Code with terminal access

### Steps:

#### 1. Frontend (Already Running ✓)
```bash
# Terminal 1 - Frontend is running on http://localhost:3000
# Keep it running - Server shows at http://localhost:3000/login
```

#### 2. Backend Setup (Do This Next)

**Step A: Set up MongoDB**
See **MONGODB_SETUP.md** for detailed instructions. Choose one:
- **MongoDB Atlas** (Recommended, Free Cloud) - 5 minutes
- **Local MongoDB** (Advanced) - 10 minutes

**Step B: Start Backend**
```bash
# Terminal 2 - Backend
cd backend

# If using MongoDB locally, make sure mongod is running in another terminal
# Then:
npm start

# Server will start on http://localhost:5000
# You should see: "MongoDB Connected" message
```

**Step C: Seed Test Users** (Run this ONCE, in a new terminal)
```bash
cd backend
npm seed

# Creates:
# Admin: admin@example.com / 1234
# User: user@example.com / 1234
```

---

## 🎨 Professional Theme Applied

### Frontend Design:
- **Color Scheme**: Green/Blue eco-friendly palette
- **Typography**: Modern, professional fonts
- **Components**: Material-UI (industry standard)
- **Responsive**: Mobile, Tablet, Desktop optimized
- **Accessibility**: WCAG compliant

### Pages Styled:
✓ Login Page - Professional waste management theme
✓ Register Page - Coming
✓ Admin Dashboard - Coming
✓ User Dashboard - Coming
✓ Education Center - Coming
✓ Complaint Management - Coming
✓ Vehicle Tracking - Coming

---

## 🧪 Test Login Credentials

### Admin Account:
- **Email**: `admin@example.com`
- **Password**: `1234`
- **Access**: Full admin dashboard, all features

### Regular User Account:
- **Email**: `user@example.com`
- **Password**: `1234`
- **Access**: User dashboard, limited features

---

## 📁 Project Structure

```
waste-management-website/
├── frontend/                    # React app
│   ├── src/
│   │   ├── pages/              # Page components (Login, Dashboard, etc.)
│   │   ├── components/         # Reusable UI components
│   │   ├── services/           # API calls
│   │   ├── context/            # Auth state management
│   │   └── utils/              # Helper functions
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Node.js/Express API
│   ├── src/
│   │   ├── models/             # MongoDB schemas (User, Bin, Complaint, etc.)
│   │   ├── controllers/        # Business logic
│   │   ├── routes/             # API endpoints
│   │   ├── middleware/         # Auth, validation, error handling
│   │   └── services/           # External services
│   ├── config/                 # Database & JWT config
│   ├── seed.js                 # Database seeding script
│   ├── server.js               # Entry point
│   ├── package.json
│   └── .env                    # Environment variables
│
├── database/                    # Migration scripts
├── deployment/                  # Docker files
└── docs/                        # Documentation
```

---

## 🔧 Environment Variables

### Backend (.env) - Already Configured:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/waste-management
JWT_SECRET=ecocareSecret2026JwtToken
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env) - Default Values:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 API Endpoints

### Authentication Routes:
```
POST   /api/auth/register    - Create new user
POST   /api/auth/login       - User login
GET    /api/auth/profile     - Get user profile
PUT    /api/auth/profile     - Update profile
DELETE /api/auth/account     - Delete account
```

### Bins Management:
```
GET    /api/bins             - Get all bins
POST   /api/bins             - Create bin
GET    /api/bins/:id         - Get bin details
PUT    /api/bins/:id         - Update bin
DELETE /api/bins/:id         - Delete bin
```

### Other Routes:
```
/api/vehicles/              - Vehicle management
/api/complaints/            - Complaint handling
/api/education/             - Education content
/api/routes/                - Collection routes
```

---

## 🐛 Troubleshooting

### Frontend Issues:
| Problem | Solution |
|---------|----------|
| Port 3000 already in use | `npx kill-port 3000` then restart |
| Module not found | Run `npm install` in frontend folder |
| Blank page | Check browser console (F12) for errors |

### Backend Issues:
| Problem | Solution |
|---------|----------|
| MongoDB connection failed | See MONGODB_SETUP.md |
| Port 5000 already in use | `npx kill-port 5000` then restart |
| Seed fails | Ensure MongoDB is running first |
| CORS errors | Check backend/.env CORS_ORIGIN setting |

---

## 📝 Current Implementation Status

### ✅ Completed:
- [x] Professional login page with eco-theme
- [x] Route protection (admin & user levels)
- [x] Navbar hides before login
- [x] Login redirects to home
- [x] Backend API structure
- [x] Database models (User, Bin, etc.)
- [x] Seed script for test users
- [x] Environment variables setup

### 🚧 In Progress:
- [ ] MongoDB connection
- [ ] Backend authentication endpoints
- [ ] Dashboard pages styling

### ⚠️ Todo:
- [ ] Admin dashboard design
- [ ] User dashboard customization
- [ ] Education center content
- [ ] Complaint management UI
- [ ] Vehicle tracking maps
- [ ] Real-time notifications
- [ ] Production deployment

---

## 🎯 Next Steps

1. **Set up MongoDB**
   - Follow MONGODB_SETUP.md for Atlas (recommended) or local setup

2. **Start Backend Server**
   - Run `npm start` in backend folder
   - Seed test users with `npm seed`

3. **Test Login**
   - Go to http://localhost:3000
   - Try admin credentials
   - Verify you reach dashboard

4. **Customize Dashboard**
   - Update theme colors in components
   - Add company logo/branding
   - Customize dashboard cards

---

## 📞 Support & Documentation

- **Backend Docs**: See `backend/src/controllers/` for API logic
- **Frontend Components**: See `frontend/src/components/`
- **API Guide**: See `docs/MAP_AND_TRACKING_API.md`

---

## 🔐 Security Notes

⚠️ **For Production:**
- Change JWT_SECRET in .env to strong random string
- Use environment-specific .env files
- Enable HTTPS/SSL
- Use proper database backups
- Implement rate limiting (already configured)
- Add request validation (already configured)
- Use Cloudinary API keys for image uploads
- Add Google Maps API key

---

**Version**: 1.0.0  
**Last Updated**: March 4, 2026  
**Status**: Development Phase ✓  
**Ready for Testing**: ✓
