# Waste Management Web Platform - Complete Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [Installation & Setup](#installation--setup)
6. [API Documentation](#api-documentation)
7. [Database Schema](#database-schema)
8. [Frontend Guide](#frontend-guide)
9. [Real-Time Features](#real-time-features)
10. [Deployment](#deployment)
11. [Security](#security)
12. [Troubleshooting](#troubleshooting)

---

## Overview

The Waste Management Web Platform is a comprehensive solution that connects citizens with municipal waste management authorities. It provides real-time tracking of waste collection vehicles, bin location services, complaint management, and educational content about proper waste management practices.

### Key Features

- **Citizens (Public Users)**
  - Find nearby waste bins with real-time fill levels
  - Track waste collection vehicles in real-time
  - Submit and track complaints
  - Access educational content about waste management

- **Administrators**
  - Monitor all operations from a centralized dashboard
  - Manage complaints and assign to staff
  - Track vehicle locations and efficiency
  - Manage bins and analytics
  - Upload and manage educational content

---

## Project Structure

```
waste-management-website/
├── backend/                          # Node.js Express backend
│   ├── src/
│   │   ├── models/                   # MongoDB schemas
│   │   │   ├── User.js
│   │   │   ├── Bin.js
│   │   │   ├── Vehicle.js
│   │   │   ├── Complaint.js
│   │   │   ├── Route.js
│   │   │   └── EducationContent.js
│   │   ├── controllers/              # Business logic
│   │   ├── routes/                   # API endpoints
│   │   ├── middleware/               # Auth, error handling, rate limiting
│   │   └── socket/                   # WebSocket handlers
│   ├── config/
│   │   ├── database.js               # MongoDB connection
│   │   └── jwt.js                    # JWT utilities
│   ├── server.js                     # Main server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── pages/                    # Page components
│   │   ├── components/               # Reusable components
│   │   ├── services/                 # API services
│   │   ├── context/                  # React context (Auth)
│   │   ├── utils/                    # Helper functions
│   │   ├── App.jsx                   # Main app component
│   │   └── main.jsx                  # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── deployment/                       # Docker & deployment configs
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── docker-compose.yml
│   └── nginx.conf
│
├── docs/                             # Documentation
└── README.md
```

---

## System Architecture

### Three-Layer Architecture

```
┌─────────────────────────────────────────┐
│    Presentation Layer (React)           │
│  - User Dashboard                       │
│  - Admin Dashboard                      │
│  - Maps & Real-time UI                  │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Application Layer (Express.js)        │
│  - REST API                             │
│  - Business Logic                       │
│  - Authentication & Authorization       │
│  - WebSocket Server                     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│     Data Layer (MongoDB)                │
│  - Users, Bins, Vehicles                │
│  - Complaints, Routes, Content          │
│  - Geospatial Indexing                  │
└─────────────────────────────────────────┘
```

---

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (v4.18.2)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs password hashing
- **Real-time**: Socket.IO for WebSocket communication
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer + Cloudinary

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **UI Library**: Material-UI (MUI)
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Maps**: Leaflet/Mapbox (optional)
- **Charts**: Chart.js + React-ChartJS-2
- **Build Tool**: Vite

### Deployment
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx
- **Database**: MongoDB

---

## Installation & Setup

### Prerequisites

- Node.js 16+ installed
- MongoDB 5+ installed and running
- Docker & Docker Compose (for containerized deployment)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env with your configuration**
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/waste-management
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRATION=7d
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env**
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   VITE_GOOGLE_MAPS_API_KEY=your_key_here
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

---

## API Documentation

### Authentication Endpoints

```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
PUT /api/auth/profile
DELETE /api/auth/account
```

### Bins Endpoints

```
GET /api/bins                          # Get all bins with filters
GET /api/bins/:id                      # Get specific bin
POST /api/bins                         # Create bin (admin only)
PUT /api/bins/:id                      # Update bin (admin only)
DELETE /api/bins/:id                   # Delete bin (admin only)
GET /api/bins/analytics                # Get analytics (admin only)
```

### Vehicles Endpoints

```
GET /api/vehicles                      # Get all vehicles
GET /api/vehicles/:id                  # Get specific vehicle
POST /api/vehicles                     # Create vehicle (admin only)
PUT /api/vehicles/:id/location         # Update location
PUT /api/vehicles/:id/status           # Update status (admin only)
GET /api/vehicles/analytics            # Get analytics (admin only)
```

### Complaints Endpoints

```
POST /api/complaints                   # Submit complaint
GET /api/complaints                    # Get complaints
GET /api/complaints/:id                # Get complaint details
PUT /api/complaints/:id/status         # Update status (admin only)
PUT /api/complaints/:id/assign         # Assign complaint (admin only)
GET /api/complaints/analytics          # Get analytics (admin only)
```

### Education Endpoints

```
GET /api/education                     # Get published content
GET /api/education/:id                 # Get specific content
POST /api/education                    # Create content (admin only)
PUT /api/education/:id                 # Update content (admin only)
DELETE /api/education/:id              # Delete content (admin only)
PUT /api/education/:id/like            # Like content
GET /api/education/analytics           # Get analytics (admin only)
```

### Routes Endpoints

```
GET /api/routes                        # Get routes
GET /api/routes/:id                    # Get route details
POST /api/routes                       # Create route (admin only)
PUT /api/routes/:id/status             # Update route status (admin only)
PUT /api/routes/:id/stop               # Update stop (driver only)
GET /api/routes/analytics              # Get analytics (admin only)
```

---

## Database Schema

### Users Collection
```javascript
{
  userId: String (UUID),
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: Object,
  role: String (user/admin),
  profilePicture: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Bins Collection
```javascript
{
  binId: String (UUID),
  location: GeoJSON Point,
  address: Object,
  wasteType: String (organic/plastic/mixed/hazardous/recyclable),
  capacity: Number,
  currentFillLevel: Number (0-100),
  status: String (active/inactive/full/maintenance),
  lastCollectedAt: Date,
  maintenanceHistory: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### Vehicles Collection
```javascript
{
  vehicleId: String (UUID),
  registrationNumber: String (unique),
  driverName: String,
  driverContact: String,
  vehicleType: String (compactor/tipper/open_bed),
  capacity: Number,
  currentLoad: Number,
  currentLocation: GeoJSON Point,
  currentRoute: ObjectId (ref: Route),
  status: String (active/offline/on_break/in_maintenance),
  totalCollections: Number,
  totalDistance: Number,
  lastUpdated: Date
}
```

### Complaints Collection
```javascript
{
  complaintId: String (UUID),
  userId: ObjectId (ref: User),
  binId: ObjectId (ref: Bin),
  vehicleId: ObjectId (ref: Vehicle),
  category: String (technical/driver_behaviour/bin_damage/...),
  subject: String,
  description: String,
  severity: String (low/medium/high/critical),
  location: GeoJSON Point,
  attachments: Array,
  status: String (pending/acknowledged/in_progress/assigned/resolved/closed),
  assignedTo: ObjectId (ref: User),
  adminNotes: Array,
  createdAt: Date,
  resolvedAt: Date
}
```

### Routes Collection
```javascript
{
  routeId: String (UUID),
  vehicleId: ObjectId (ref: Vehicle),
  routePath: Array (coordinates),
  stops: Array (with binId, location, status),
  startTime: Date,
  endTime: Date,
  distance: Number,
  wasteCollected: Number,
  status: String (planned/in_progress/completed/cancelled)
}
```

### EducationContent Collection
```javascript
{
  contentId: String (UUID),
  title: String,
  description: String,
  category: String (waste_segregation/recycling/composting/...),
  contentType: String (video/article/infographic),
  videoURL: String,
  articleContent: String,
  infographicURL: String,
  uploadedBy: ObjectId (ref: User),
  views: Number,
  likes: Number,
  published: Boolean,
  scheduledPublishDate: Date,
  tags: Array,
  uploadDate: Date
}
```

---

## Frontend Guide

### Directory Structure

- **pages/**: Full page components (Home, Dashboard, BinsNearMe, etc.)
- **components/**: Reusable UI components
- **services/**: API client and service functions
- **context/**: React Context for state management (Auth)
- **utils/**: Helper functions and custom hooks

### Available Pages

#### Public
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/education` - Education center (public content)

#### User Routes
- `/user/dashboard` - User dashboard
- `/user/bins` - Find bins near me
- `/user/tracking` - Track vehicles
- `/user/complaints` - Submit/manage complaints

#### Admin Routes
- `/admin/dashboard` - Admin dashboard with analytics
- `/admin/complaints` - Manage all complaints
- `/admin/vehicles` - Track all vehicles and manage routes
- `/admin/education` - Manage educational content

### Using Services

```javascript
import binService from '../services/binService.js';

// Fetch nearby bins
const nearbyBins = await binService.getNearbyBins(latitude, longitude, radius);

// Create a complaint
const complaint = await complaintService.createComplaint({
  category: 'technical',
  subject: 'Damaged bin',
  description: 'The bin at the corner is damaged',
  severity: 'high'
});
```

---

## Real-Time Features

The platform uses Socket.IO for real-time updates:

### Socket Events

**Client → Server**
- `userLogin` - User authentication
- `updateVehicleLocation` - Vehicle location update (driver only)
- `updateBinFillLevel` - Bin fill level update
- `complaintStatusChanged` - Complaint status update
- `checkNearbyVehicles` - Find nearby vehicles

**Server → Client**
- `vehicleLocationUpdated` - New vehicle location
- `binFillLevelUpdated` - Bin fill level changed
- `complaintStatusUpdated` - User's complaint status changed
- `complaintUpdated` - Any complaint update (admin)
- `binNeedsCollection` - Bin fill level >= 85%
- `nearbyVehicles` - Vehicles within specified radius
- `notification` - General notifications

### Implementing Real-Time Features

```javascript
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL);

// Listen for vehicle updates
socket.on('vehicleLocationUpdated', (data) => {
  console.log('Vehicle location:', data);
  // Update map/UI with new location
});

// Send location update (for drivers)
socket.emit('updateVehicleLocation', {
  vehicleId: '123',
  latitude: 40.7128,
  longitude: -74.0060,
  status: 'active'
});
```

---

## Deployment

### Using Docker Compose

1. **Build and start all services**
   ```bash
   cd deployment
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - MongoDB: localhost:27017

3. **Stop services**
   ```bash
   docker-compose down
   ```

### Production Deployment

1. **Update environment variables in docker-compose.yml**
   - Change JWT_SECRET
   - Update MONGODB_URI for production MongoDB
   - Set NODE_ENV=production

2. **Deploy with Docker Swarm or Kubernetes**
   ```bash
   docker stack deploy -c deployment/docker-compose.yml waste-mgmt
   ```

3. **Configure domain and SSL**
   - Update CORS_ORIGIN in .env
   - Configure Nginx for HTTPS
   - Set up SSL certificates (Let's Encrypt recommended)

---

## Security

### Implemented Security Features

1. **Authentication & Authorization**
   - JWT-based authentication
   - bcryptjs password hashing
   - Role-based access control (RBAC)

2. **API Security**
   - Helmet.js for HTTP headers
   - CORS enabled only for trusted origins
   - Rate limiting on login and creation endpoints
   - Input validation on all endpoints

3. **Data Protection**
   - MongoDB connection with credentials
   - Environment variables for secrets
   - HTTPS recommended for production

4. **Best Practices**
   - Never commit .env files
   - Use strong JWT_SECRET (32+ characters)
   - Regularly update dependencies
   - Implement CORS properly
   - Use HTTPS in production

### Security Checklist

- [ ] Change all default credentials
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up firewall rules
- [ ] Enable MongoDB authentication
- [ ] Regular backups
- [ ] Monitor logs and errors
- [ ] Keep dependencies updated
- [ ] Enable rate limiting

---

## Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Check MongoDB is running: `mongosh` or `mongo`
- Verify MONGODB_URI in .env
- Check credentials if using authentication

**Port Already in Use**
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

**JWT Errors**
- Ensure JWT_SECRET is set
- Check token is being sent in Authorization header
- Verify token hasn't expired

### Frontend Issues

**Blank Page or Errors**
- Clear browser cache: Ctrl+Shift+Delete
- Check console for errors: F12
- Verify backend is running and accessible

**API Connection Error**
- Check VITE_API_BASE_URL in .env
- Verify backend server is running
- Check CORS settings in backend

**Map Not Loading**
- Verify Google Maps API key
- Check API key has necessary permissions
- Review quota limits

### Docker Issues

**Container won't start**
```bash
docker logs <container_name>
```

**Permission denied**
```bash
sudo usermod -aG docker $USER
```

**Port conflicts**
- Change port in docker-compose.yml
- Rebuild containers

---

## Contributing

1. Create a new branch for features
2. Follow the existing code structure
3. Write meaningful commit messages
4. Test thoroughly before submitting
5. Update documentation as needed

---

## License

MIT License - See LICENSE file for details

---

## Support

For issues and questions:
- Check existing documentation
- Review code comments
- Check GitHub issues
- Contact the development team

---

**Last Updated**: March 2026
**Version**: 1.0.0
**Status**: Production Ready
