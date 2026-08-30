# Waste Management Website

A comprehensive web platform for waste management that serves both the public and administrative users, enabling efficient waste collection, real-time tracking, and community education.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Public Section Features](#public-section-features)
- [Admin Section Features](#admin-section-features)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Project Overview

This waste management system is designed to bridge the gap between citizens and waste management authorities. It provides:

- **For Public Users**: Easy management of household waste, location-based bin discovery, real-time vehicle tracking, and a complaint system
- **For Administrators**: Comprehensive oversight of complaints, driver management, vehicle tracking, bin optimization, and educational content distribution

---

## 👥 Public Section Features

### 1. **Home Section**
   - **Dustbin Management**: View and manage all dustbins assigned to the user's home
   - **Account Management**: 
     - Update personal account details (name, address, contact information, etc.)
     - Delete account option with confirmation
   - **Dashboard**: Overview of user's waste management activities

### 2. **Bin Near Me Section**
   - **Map Integration**: Interactive map showing all available bins in the vicinity
   - **Location-Based Search**: Find bins based on:
     - Current location (GPS)
     - Specific address
     - Custom radius (e.g., within 1 km, 2 km, etc.)
   - **Bin Information**: 
     - Bin capacity and current fill level
     - Distance from user's location
     - Type of waste accepted
     - Contact information for the bin location

### 3. **Live Tracking Section**
   - **Real-Time Vehicle Tracking**: Track municipal waste collection vehicles in real-time
   - **Vehicle Information**:
     - Current location on map
     - Estimated time to reach user's location
     - Vehicle type and capacity
     - Driver information
   - **Notifications**: Get alerts when a vehicle is approaching

### 4. **Complaint Section**
   - **Multiple Complaint Categories**:
     - **Technical Issues**: Report app/website bugs or technical problems
     - **Driver Complaints**: Issues related to driver behavior or misconduct
     - **Dustbin Complaints**: Report damaged, overflowing, or missing bins
     - **Other Complaints**: General feedback or miscellaneous issues
   - **Complaint Filing**:
     - Detailed description with attachments (photos/videos)
     - Category selection
     - Severity level selection
   - **Complaint Tracking**: Monitor status of submitted complaints

### 5. **Education Section**
   - **Waste Management Content**: Educational materials on:
     - Types of waste and proper segregation
     - Environmental impact of improper waste disposal
     - Recycling best practices
     - Composting and organic waste management
     - Hazardous waste handling
   - **Content Formats**: Real and short-form videos
   - **Interactive Learning**: Educational resources and guides

---

## 🔐 Admin Section Features

### 1. **Complaints Management**
   - **Centralized Dashboard**: View all complaints from all users
   - **Complaint Categories**: Filter and organize complaints by:
     - Technical Issues
     - Driver Complaints
     - Dustbin Issues
     - Other Complaints
   - **Complaint Actions**:
     - View detailed complaint information
     - Assign to responsible team member
     - Update complaint status (Pending, In Progress, Resolved)
     - Add internal notes and communications
     - Mark as resolved

### 2. **Live Tracking & History Management**
   - **Driver Live Tracking**: 
     - Real-time location tracking of all drivers
     - View active routes on interactive map
     - Driver status (Active, On Break, Offline)
   - **Historical Route Data**:
     - View past routes taken by each driver
     - Track driver efficiency and patterns
     - Performance metrics and reports
   - **Analytics**: 
     - Most frequently used routes
     - Peak collection hours
     - Driver productivity metrics

### 3. **Bin Location & Analytics**
   - **Global Bin Management**: View all dustbins across the entire region (not just locality)
   - **Bin Information**:
     - Real-time bin location and status
     - Current fill level percentage
     - Last collection date and time
   - **Bin Fill-Rate Analytics**:
     - Track which bins fill up quickly vs. slowly
     - Identify high-demand areas
     - Monitor underutilized bins
   - **Optimization Recommendations**: 
     - Suggest bin relocation based on usage patterns
     - Adjust collection schedules based on demand
     - Capacity planning

### 4. **Education Content Management**
   - **Upload Interface**: 
     - Add short educational videos
     - Organize content by category
   - **Content Control**:
     - Schedule content publication
     - Edit or remove existing content
   - **Video Management**:
     - Support multiple video formats
     - Add titles, descriptions, and tags
     - Analytics on content views and engagement

---

## 🛠 Technology Stack

*(To be finalized during development planning)*

**Suggested Technologies:**
- **Frontend**: React.js / Vue.js / Angular
- **Backend**: Node.js / Python / Java
- **Database**: MongoDB / PostgreSQL
- **Maps Integration**: Google Maps API / Mapbox
- **Real-time Tracking**: WebSockets / Firebase
- **Video Hosting**: AWS S3 / Cloudinary
- **Authentication**: JWT / OAuth 2.0
- **Deployment**: Docker / Kubernetes

---

## ⚙️ Installation & Setup

*(To be added after technology stack selection)*

### Prerequisites
- Node.js / Python / Java (depending on backend choice)
- Git
- Database system setup

### Steps
1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Set up database
5. Run migration scripts
6. Start development server

---

## 📁 Project Structure

```
waste-management-website/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── public/
│   │   │   │   ├── Home/
│   │   │   │   ├── BinNearMe/
│   │   │   │   ├── LiveTracking/
│   │   │   │   ├── Complaints/
│   │   │   │   └── Education/
│   │   │   ├── admin/
│   │   │   │   ├── ComplaintsManagement/
│   │   │   │   ├── DriverTracking/
│   │   │   │   ├── BinManagement/
│   │   │   │   └── EducationManagement/
│   │   │   └── common/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
├── backend/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── public/
│   │   │   ├── admin/
│   │   │   └── auth/
│   │   └── controllers/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── services/
│   └── server.js
├── database/
│   └── migrations/
├── docs/
│   └── API_DOCUMENTATION.md
└── # 🌍 Waste Management Web Platform

[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![Node Version](https://img.shields.io/badge/Node-18%2B-green)](https://nodejs.org)

A comprehensive, production-ready waste management system that connects citizens with municipal waste authorities, providing real-time vehicle tracking, bin location services, complaint management, and educational content.

## 🎯 Key Features

### 👥 Public Users
- 📍 **Find Waste Bins** - Locate nearby waste bins with real-time fill levels
- 🚗 **Live Vehicle Tracking** - Track waste collection vehicles in real-time
- 📝 **Submit Complaints** - Report issues and track resolution
- 📚 **Learn Waste Management** - Access educational content about proper waste practices
- 🔔 **Receive Notifications** - Get alerts for collection schedules

### 👨‍💼 Administrators
- 📊 **Centralized Dashboard** - Monitor all operations in real-time
- 🗑️ **Bin Management** - Add, update, and remove waste bins
- 🚙 **Fleet Management** - Track all vehicles and assign routes
- 💬 **Complaint Management** - Manage and assign complaints to staff
- 📖 **Content Management** - Upload and manage educational materials
- 📈 **Analytics & Reports** - Detailed insights into operations

---

## 🏗️ Architecture

```
    ┌─────────────────────────────────────┐
    │    React Frontend (Vite)            │
    │    - Material-UI Components         │
    │    - Real-time Updates (Socket.IO)  │
    └──────────────┬──────────────────────┘
                   │ REST API + WebSocket
                   ▼
    ┌─────────────────────────────────────┐
    │    Express.js Backend               │
    │    - REST API                       │
    │    - WebSocket Server               │
    │    - Business Logic                 │
    │    - Authentication (JWT)           │
    └──────────────┬──────────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────────┐
    │    MongoDB Database                 │
    │    - Geospatial Indexing            │
    │    - Real-time Data Storage         │
    └─────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB 5+
- Docker & Docker Compose (optional)

### Option 1: Local Development

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Option 2: Docker Deployment

```bash
cd deployment
docker-compose up -d
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

---

## 📊 Technology Stack

### Frontend
- **React 18** - UI framework
- **Material-UI** - Component library
- **Vite** - Build tool
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - WebSocket support
- **JWT** - Authentication

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **Nginx** - Reverse proxy

---

## 📁 Project Structure

```
waste-management-website/
├── backend/                    # Express.js server
│   ├── src/
│   │   ├── models/            # MongoDB schemas
│   │   ├── controllers/       # Business logic
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth & utilities
│   │   └── socket/            # WebSocket handlers
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── deployment/                 # Docker configs
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── nginx.conf
│
└── docs/                       # Documentation
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/profile           - Get user profile
PUT    /api/auth/profile           - Update profile
DELETE /api/auth/account           - Delete account
```

### Bins Management
```
GET    /api/bins                   - Get all bins (with filters)
GET    /api/bins/:id               - Get specific bin
POST   /api/bins                   - Create bin [ADMIN]
PUT    /api/bins/:id               - Update bin [ADMIN]
DELETE /api/bins/:id               - Delete bin [ADMIN]
GET    /api/bins/analytics         - Get analytics [ADMIN]
```

### Vehicle Tracking
```
GET    /api/vehicles               - Get all vehicles
GET    /api/vehicles/:id           - Get vehicle details
POST   /api/vehicles               - Create vehicle [ADMIN]
PUT    /api/vehicles/:id/location  - Update location
PUT    /api/vehicles/:id/status    - Update status [ADMIN]
GET    /api/vehicles/analytics     - Get analytics [ADMIN]
```

### Complaints
```
POST   /api/complaints             - Submit complaint
GET    /api/complaints             - Get complaints
GET    /api/complaints/:id         - Get complaint details
PUT    /api/complaints/:id/status  - Update status [ADMIN]
GET    /api/complaints/analytics   - Get analytics [ADMIN]
```

### Education Content
```
GET    /api/education              - Get published content
GET    /api/education/:id          - Get content details
POST   /api/education              - Create content [ADMIN]
PUT    /api/education/:id          - Update content [ADMIN]
DELETE /api/education/:id          - Delete content [ADMIN]
PUT    /api/education/:id/like     - Like content
```

### Routes
```
GET    /api/routes                 - Get routes
POST   /api/routes                 - Create route [ADMIN]
PUT    /api/routes/:id/status      - Update route status
PUT    /api/routes/:id/stop        - Update stop details
```

---

## 🔐 Security Features

✅ JWT-based authentication
✅ Bcryptjs password hashing
✅ Role-based access control (RBAC)
✅ Helmet.js security headers
✅ CORS protection
✅ Rate limiting
✅ Input validation
✅ Geospatial data protection

---

## 📊 Real-Time Features

The platform uses **Socket.IO** for real-time updates:

### Real-Time Events
- 🚗 Vehicle location updates
- 🗑️ Bin fill level changes
- 📝 Complaint status updates
- 🔔 Notifications
- 📍 Nearby vehicle alerts

### Example Socket Connection
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('vehicleLocationUpdated', (data) => {
  console.log('Vehicle moved:', data);
  // Update map with new location
});

socket.emit('updateVehicleLocation', {
  vehicleId: '123',
  latitude: 40.7128,
  longitude: -74.0060
});
```

---

## 📈 Database Models

### Users
- User registration and authentication
- Role-based access (user/admin)
- Profile management

### Bins
- Geospatial location tracking
- Fill level monitoring
- Collection schedule management
- Maintenance history

### Vehicles
- Real-time location tracking
- Route assignments
- Collection statistics
- Driver information

### Complaints
- Categorized issue tracking
- Severity levels
- Assignment to staff
- Resolution tracking

### Routes
- Daily collection routes
- Stop management
- Distance and waste tracking
- Completion statistics

### Education Content
- Video hosting integration
- Article management
- Infographic support
- View and engagement tracking

---

## 🛠️ Development

### Running in Development Mode

**Backend**
```bash
cd backend
npm install
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

### Building for Production

**Backend**
```bash
docker build -f deployment/Dockerfile.backend -t waste-backend:latest .
```

**Frontend**
```bash
docker build -f deployment/Dockerfile.frontend -t waste-frontend:latest .
```

---

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/waste-management
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

---

## 📚 Documentation

- [Complete Guide](docs/COMPLETE_GUIDE.md) - Comprehensive documentation
- [API Reference](#-api-endpoints) - Full API documentation
- [Database Schema](#-database-models) - Data model information

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for sustainable cities**

Version: 1.0.0 | Status: Production Ready ✅
```

---

## 🚀 Future Enhancements

- Push notifications for important alerts
- Mobile app development
- AI-based waste prediction and optimization
- Integration with municipal systems
- Community rewards and gamification
- Multi-language support

---

## 📝 Contributing

*(Contribution guidelines to be added)*

---

## 📄 License

*(License to be determined)*

---

## 📧 Contact & Support

*(Contact information to be added)*

---

**Last Updated**: December 20, 2025

*Project is in the planning phase. Implementation details will be added as development progresses.*