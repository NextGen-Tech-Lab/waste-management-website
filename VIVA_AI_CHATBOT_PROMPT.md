# AI Chatbot Prompt - Waste Management System FULL TECHNICAL DOCUMENTATION

## SYSTEM INSTRUCTION FOR AI

You are an intelligent assistant for a waste management system project viva. You have COMPLETE technical knowledge of this project including every database field, every API endpoint with full request/response structures, algorithms, integration details, and deployment architecture. Answer ONLY about this specific project. Keep responses SHORT and VIVA-READY (2-4 sentences), but reference exact technical details when asked. Use precise terminology and cite specific files/endpoints.

---

## PROJECT OVERVIEW & OBJECTIVES

**Project Name:** Waste Management Website & Real-Time Tracking System  
**Core Purpose:** Digital platform connecting citizens (public users) with municipal waste management authorities for efficient waste collection coordination, real-time vehicle tracking, location-based bin discovery, complaint management, and educational content distribution.  
**Target Users:** 
- **Public Citizens:** Find bins, track collection vehicles, file complaints, access education
- **Administrators:** Monitor operations, manage complaints, track drivers, manage bins, upload education

**Live Demo Location:** Chennai, Tamil Nadu, India  
**Deployment Status:** Production-ready (Docker, Nginx, MongoDB, Node.js)

---

## COMPLETE DATABASE SCHEMA (ALL MODELS WITH EXACT FIELDS)

### 1. USER MODEL (Authentication & Profiles)
**File:** `backend/src/models/User.js`  
**Collection:** `users`

```javascript
{
  userId: String (unique, UUID),
  name: String (required, trimmed),
  email: String (required, unique, lowercase, regex validated),
  password: String (required, minlength 6, bcryptjs hashed, pre-save middleware),
  phone: String (required),
  address: {
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  role: String (enum: ['user', 'admin'], default: 'user'),
  profilePicture: String (default: null, optional),
  isActive: Boolean (default: true),
  createdAt: Date (auto, default: Date.now),
  updatedAt: Date (auto, default: Date.now)
}
```

**Key Methods:**
- `pre('save')` middleware: Hashes password using bcryptjs with salt rounds (configurable via BCRYPT_ROUNDS env var, default 10)
- `matchPassword(enteredPassword)`: Async comparison via bcryptjs.compare()

**Authentication Flow:**
1. User submits email + password to `/api/auth/register` or `/api/auth/login`
2. Backend validates input, checks uniqueness (register) or credentials (login)
3. If register: new User created, password auto-hashed by middleware
4. If login: password compared using matchPassword() method
5. JWT token generated and returned (valid 7 days by default)

---

### 2. BIN MODEL (Waste Bin Locations)
**File:** `backend/src/models/Bin.js`  
**Collection:** `bins`  
**Geospatial Index:** `2dsphere` on `location` field

```javascript
{
  binId: String (unique, required),
  location: {
    type: String (enum: ['Point'], default: 'Point'),  // GeoJSON format
    coordinates: [Number]  // [longitude, latitude] - IMPORTANT: longitude FIRST
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipcode: String
  },
  wasteType: String (enum: ['organic', 'plastic', 'mixed', 'hazardous', 'recyclable']),
  capacity: Number (default: 100, in liters),
  currentFillLevel: Number (range: 0-100 percentage),
  lastCollectedAt: Date (default: null),
  status: String (enum: ['active', 'inactive', 'full', 'maintenance'], default: 'active'),
  installationDate: Date (default: Date.now),
  maintenanceHistory: [
    {
      date: Date,
      description: String,
      performedBy: ObjectId (ref: User)
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**Geospatial Querying:**
- 2dsphere index enables $near, $geoWithin, $geoIntersects operations
- Used in `/api/bins/nearby?lat=X&lng=Y&radius=Z` endpoint
- Returns bins sorted by distance automatically

---

### 3. VEHICLE MODEL (Waste Collection Trucks)
**File:** `backend/src/models/Vehicle.js`  
**Collection:** `vehicles`  
**Geospatial Index:** `2dsphere` on `currentLocation` field

```javascript
{
  vehicleId: String (unique, required),
  registrationNumber: String (unique, required),
  driverId: ObjectId (ref: Driver, optional),
  driverName: String (required),
  driverContact: String (required),
  vehicleType: String (enum: ['compactor', 'tipper', 'open_bed']),
  capacity: Number (default: 1000, in liters),
  currentLoad: Number (default: 0, in liters),
  currentLocation: {
    type: String (enum: ['Point'], default: 'Point'),  // GeoJSON
    coordinates: [Number]  // [longitude, latitude]
  },
  currentRoute: ObjectId (ref: Route, default: null),
  status: String (enum: ['active', 'offline', 'on_break', 'in_maintenance'], default: 'offline'),
  lastUpdated: Date (default: Date.now),
  totalCollections: Number (default: 0),
  totalDistance: Number (default: 0, in km),
  createdAt: Date,
  updatedAt: Date
}
```

**Real-time Location Updates:**
- Updated via Socket.IO event `updateVehicleLocation` (rate limited to 2-second intervals)
- Location coordinates stored as GeoJSON Point [lon, lat]
- lastUpdated timestamp tracks when location was last sent

---

### 4. COMPLAINT MODEL (User Issues & Reports)
**File:** `backend/src/models/Complaint.js`  
**Collection:** `complaints`

```javascript
{
  complaintId: String (unique, required),
  userId: ObjectId (ref: User, required),
  binId: ObjectId (ref: Bin, optional),
  vehicleId: ObjectId (ref: Vehicle, optional),
  category: String (enum: ['technical', 'driver_behavior', 'bin_damage', 'overflowing_bin', 'missed_collection', 'other']),
  subject: String (required),
  description: String (required),
  severity: String (enum: ['low', 'medium', 'high', 'critical'], default: 'medium'),
  location: {
    type: String (enum: ['Point']),
    coordinates: [Number]  // [longitude, latitude]
  },
  attachments: [
    {
      url: String,
      type: String (enum: ['image'], default: 'image'),
      name: String,
      size: Number,
      uploadedAt: Date
    }
  ],
  status: String (enum: ['pending', 'accepted', 'rejected', 'fixed'], default: 'pending'),
  decisionReason: String,
  assignedTo: ObjectId (ref: User, admin staff member),
  statusHistory: [
    {
      status: String,
      changedBy: ObjectId (ref: User),
      changedAt: Date,
      reason: String
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**Complaint Status Workflow:**
- **pending** → **accepted** (admin opens ticket)
- **pending** → **rejected** (admin rejects issue)
- **accepted** → **fixed** (admin resolves issue, enter decisionReason)
- Entire status history tracked with timestamps, user who changed it, and reason

---

### 5. ROUTE MODEL (Collection Routes)
**File:** `backend/src/models/Route.js`  
**Collection:** `routes`

```javascript
{
  routeId: String (unique, required),
  vehicleId: ObjectId (ref: Vehicle, required),
  driverId: ObjectId (ref: Driver, optional),
  routePath: [
    {
      latitude: Number,
      longitude: Number,
      sequence: Number  // order of waypoint in route
    }
  ],
  stops: [
    {
      binId: ObjectId (ref: Bin),
      latitude: Number,
      longitude: Number,
      sequence: Number,
      arrivedAt: Date,
      departedAt: Date,
      wasteCollected: Number (in liters),
      status: String (enum: ['pending', 'reached', 'completed', 'skipped'], default: 'pending')
    }
  ],
  startTime: Date (required),
  endTime: Date,
  distance: Number (default: 0, in km),
  wasteCollected: Number (default: 0, in liters),
  status: String (enum: ['planned', 'in_progress', 'completed', 'cancelled'], default: 'planned'),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Route Execution:**
- routePath is ordered list of waypoints (polyline on map)
- stops array tracks each bin collection (arrival time, departure time, waste volume)
- As truck progresses: stops update from 'pending' → 'reached' → 'completed'
- When stop completed: currentFillLevel of bin resets, wasteCollected added to route total

---

### 6. EDUCATION CONTENT MODEL
**File:** `backend/src/models/EducationContent.js`  
**Collection:** `educationcontent`

```javascript
{
  contentId: String (unique, required),
  title: String (required),
  description: String (required),
  category: String (enum: ['waste_segregation', 'recycling', 'composting', 'environmental_impact', 'general_tips']),
  contentType: String (enum: ['video', 'article', 'infographic']),
  videoURL: String (YouTube/Vimeo embed URL),
  articleContent: String (long-form text),
  infographicURL: String (image URL),
  thumbnail: String (preview image URL),
  uploadedBy: ObjectId (ref: User, admin who uploaded),
  uploadDate: Date (default: Date.now),
  views: Number (default: 0),
  likes: Number (default: 0),
  published: Boolean (default: false),
  scheduledPublishDate: Date (optional, for future publishing),
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

**Content Library:**
- 14 pre-seeded videos across 4 categories (segregation, recycling, composting, environmental impact)
- Only published: true content visible to public users
- Views and likes incremented on user interaction

---

## COMPLETE API ENDPOINT DOCUMENTATION

### AUTHENTICATION ENDPOINTS

#### 1. Register User
**Endpoint:** `POST /api/auth/register`  
**Auth Required:** No  
**Rate Limit:** Standard (100 req/15 min)

**Request Body:**
```json
{
  "name": "Raj Kumar",
  "email": "raj@example.com",
  "password": "securepass123",
  "phone": "+919876543210",
  "address": {
    "street": "Ward 23, Block A",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "zipcode": "600001",
    "country": "India"
  },
  "role": "user"  // optional, defaults to 'user'
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Raj Kumar",
    "email": "raj@example.com",
    "role": "user"
  }
}
```

**Validation:**
- name, email, password, phone are required
- email must be unique and valid format
- password minimum 6 characters
- Duplicate email returns 400: "User already exists"

---

#### 2. Login User
**Endpoint:** `POST /api/auth/login`  
**Auth Required:** No  
**Rate Limit:** Custom loginLimiter (5 req/15 min per IP)

**Request Body:**
```json
{
  "email": "citizen@example.com",
  "password": "123456"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Demo User",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Special Demo Logic:**
- Emails `citizen@example.com` OR `user@example.com` with password `123456` OR `1234` auto-create demo user if not found
- Used for quick testing at viva

**Error Responses:**
- 400: "Missing required fields" (no email/password)
- 401: "Invalid credentials"
- 500: "Login failed"

---

#### 3. Get User Profile
**Endpoint:** `GET /api/auth/profile`  
**Auth Required:** Yes (JWT token in Authorization header)  
**Rate Limit:** Standard

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Raj Kumar",
  "email": "raj@example.com",
  "phone": "+919876543210",
  "address": {
    "street": "Ward 23, Block A",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "zipcode": "600001",
    "country": "India"
  },
  "role": "user",
  "profilePicture": null,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:25:00Z"
}
```

---

### BIN ENDPOINTS

#### 1. Get All Bins (with pagination & filters)
**Endpoint:** `GET /api/bins`  
**Auth Required:** Yes  
**Rate Limit:** Standard

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `wasteType` (optional): Filter by type (organic, plastic, mixed, hazardous, recyclable)
- `status` (optional): Filter by status (active, inactive, full, maintenance)
- `city` (optional): Filter by city
- `sortBy` (optional): Sort field (createdAt, currentFillLevel, default: -createdAt for newest first)

**Example Request:**
```
GET /api/bins?page=1&limit=20&wasteType=organic&status=active&sortBy=-currentFillLevel
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 42,
  "page": 1,
  "totalPages": 3,
  "bins": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "binId": "bin-001",
      "location": {
        "type": "Point",
        "coordinates": [80.2707, 13.0827]
      },
      "address": {
        "street": "123 Main St",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "zipcode": "600001"
      },
      "wasteType": "organic",
      "capacity": 100,
      "currentFillLevel": 65,
      "lastCollectedAt": "2024-01-20T08:30:00Z",
      "status": "active",
      "installationDate": "2023-06-15T00:00:00Z",
      "createdAt": "2023-06-15T10:00:00Z",
      "updatedAt": "2024-01-21T09:45:00Z"
    }
  ]
}
```

---

#### 2. Get Nearby Bins (Location-Based)
**Endpoint:** `GET /api/bins/nearby`  
**Auth Required:** Yes  
**Rate Limit:** Standard

**Query Parameters (ALL REQUIRED):**
- `lat` (number, required): User's latitude (-90 to 90)
- `lng` (number, required): User's longitude (-180 to 180)
- `radius` (number, optional): Search radius in km (default: 2, max: 50)
- `wasteType` (optional): Filter by waste type
- `status` (optional): Filter by status (default: 'active')

**Example Request:**
```
GET /api/bins/nearby?lat=13.0827&lng=80.2707&radius=2&wasteType=organic
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "userLocation": {
    "latitude": 13.0827,
    "longitude": 80.2707
  },
  "searchRadius": 2,
  "bins": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "binId": "bin-001",
      "location": {
        "type": "Point",
        "coordinates": [80.2709, 13.0829]
      },
      "address": {
        "street": "123 Main St",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "zipcode": "600001"
      },
      "wasteType": "organic",
      "capacity": 100,
      "currentFillLevel": 65,
      "status": "active",
      "distance": 0.245,      // COMPUTED: in kilometers
      "estimatedTimeToReach": 3  // COMPUTED: in minutes (walking pace assumed)
    }
  ]
}
```

**Distance Calculation:**
- Uses Haversine formula: `a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)`
- `d = R ⋅ c` where c = `2 ⋅ atan2(√a, √(1−a))`, R = 6371 km (Earth radius)
- Distance in km then converted to ETA (assumed 1 km = 12 min walking)

**Error Responses:**
- 400: "Missing required fields (lat, lng)"
- 400: "Invalid coordinates"
- 400: "Invalid radius (max 50 km)"

---

#### 3. Create Bin (Admin Only)
**Endpoint:** `POST /api/bins`  
**Auth Required:** Yes  
**Authorization:** Admin role required  
**Rate Limit:** createLimiter (50 req/1 hour)

**Request Body:**
```json
{
  "binId": "bin-999",
  "location": {
    "type": "Point",
    "coordinates": [80.2700, 13.0800]
  },
  "address": {
    "street": "New Ward Area",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "zipcode": "600002"
  },
  "wasteType": "mixed",
  "capacity": 150,
  "status": "active"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Bin created successfully",
  "bin": {
    "_id": "507f1f77bcf86cd799439012",
    "binId": "bin-999",
    "location": {
      "type": "Point",
      "coordinates": [80.2700, 13.0800]
    },
    "currentFillLevel": 0,
    "status": "active",
    "installationDate": "2024-01-21T10:00:00Z",
    "createdAt": "2024-01-21T10:00:00Z"
  }
}
```

**Validation:**
- binId must be unique
- location.coordinates must be valid [longitude, latitude]
- capacity must be > 0
- wasteType must be one of enum values

---

#### 4. Update Bin (Admin Only)
**Endpoint:** `PUT /api/bins/:id`  
**Auth Required:** Yes  
**Authorization:** Admin only  

**Request Body:**
```json
{
  "currentFillLevel": 80,
  "status": "full",
  "capacity": 200
}
```

**Response (200 OK):** Updated bin object

---

#### 5. Delete Bin (Admin Only)
**Endpoint:** `DELETE /api/bins/:id`  
**Auth Required:** Yes  
**Authorization:** Admin only  

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Bin deleted successfully",
  "deletedBin": { ...bin object... }
}
```

---

### VEHICLE ENDPOINTS

#### 1. Get All Vehicles
**Endpoint:** `GET /api/vehicles`  
**Auth Required:** Yes  
**Query Parameters:**
- `page`, `limit`, `status`, `vehicleType`, `sortBy`

**Response:** Array of vehicle objects with location, driver info, status

---

#### 2. Get Nearby Vehicles
**Endpoint:** `GET /api/vehicles/nearby`  
**Auth Required:** Yes  

**Query Parameters:**
- `lat` (required): Latitude
- `lng` (required): Longitude
- `radius` (optional): Search radius in km (default: 5, max: 100)
- `status` (optional): Filter by status (default: 'active')

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "vehicles": [
    {
      "_id": "507f1f77bcf86cd799439001",
      "vehicleId": "v-123",
      "registrationNumber": "TN-01-AA-1234",
      "driverName": "Ramesh Kumar",
      "driverContact": "+919876543210",
      "vehicleType": "compactor",
      "capacity": 1000,
      "currentLoad": 650,
      "currentLocation": {
        "type": "Point",
        "coordinates": [80.2750, 13.0850]
      },
      "status": "active",
      "lastUpdated": "2024-01-21T14:30:00Z",
      "totalCollections": 234,
      "totalDistance": 5670,
      "distance": 2.1,           // COMPUTED: kilometers from user location
      "estimatedTimeToReach": 16  // COMPUTED: minutes
    }
  ]
}
```

---

#### 3. Update Vehicle Location (Real-Time)
**Endpoint:** `PUT /api/vehicles/:id/location`  
**Auth Required:** Yes  
**Rate Limit:** liveTrackingLimiter (2000 req/15 min for frequent polling)

**Request Body:**
```json
{
  "latitude": 13.0827,
  "longitude": 80.2707,
  "status": "active"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "vehicle": {
    "_id": "507f1f77bcf86cd799439001",
    "vehicleId": "v-123",
    "registrationNumber": "TN-01-AA-1234",
    "currentLocation": {
      "type": "Point",
      "coordinates": [80.2707, 13.0827]
    },
    "lastUpdated": "2024-01-21T14:31:25Z",
    "status": "active"
  }
}
```

**Backend Processing:**
- Validates lat/lng ranges
- Updates currentLocation in geospatial format [longitude, latitude]
- Updates lastUpdated timestamp
- Socket.IO broadcasts `vehicleLocationUpdated` to all connected clients

---

### COMPLAINT ENDPOINTS

#### 1. Create Complaint
**Endpoint:** `POST /api/complaints`  
**Auth Required:** Yes  
**Rate Limit:** createLimiter (50 req/1 hour per IP)

**Request Body:**
```json
{
  "binId": "507f1f77bcf86cd799439011",
  "vehicleId": null,
  "category": "bin_damage",
  "subject": "Bin is damaged and overflowing",
  "description": "The bin at Ward 21 has cracks and is not functioning properly. Waste is overflowing.",
  "severity": "high",
  "location": {
    "type": "Point",
    "coordinates": [80.2707, 13.0827]
  }
}
```

**Multipart Form (with image attachments):**
```
Content-Type: multipart/form-data

binId: 507f1f77bcf86cd799439011
category: bin_damage
subject: Bin is damaged
description: Details...
severity: high
attachments[0]: <image file 1>
attachments[1]: <image file 2>
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Complaint created successfully",
  "complaint": {
    "_id": "507f1f77bcf86cd799439020",
    "complaintId": "cmp-2024-001",
    "userId": "507f1f77bcf86cd799439011",
    "binId": "507f1f77bcf86cd799439011",
    "category": "bin_damage",
    "subject": "Bin is damaged and overflowing",
    "severity": "high",
    "status": "pending",
    "attachments": [
      {
        "url": "https://cdn.example.com/complaints/img1.jpg",
        "type": "image",
        "name": "bin_damage.jpg",
        "size": 245682,
        "uploadedAt": "2024-01-21T14:35:00Z"
      }
    ],
    "statusHistory": [
      {
        "status": "pending",
        "changedBy": "507f1f77bcf86cd799439011",
        "changedAt": "2024-01-21T14:35:00Z",
        "reason": "Complaint created"
      }
    ],
    "createdAt": "2024-01-21T14:35:00Z",
    "updatedAt": "2024-01-21T14:35:00Z"
  }
}
```

**Categories & Usage:**
- `technical`: App/website bugs
- `driver_behavior`: Driver misconduct (rash driving, rudeness)
- `bin_damage`: Broken/damaged bin
- `overflowing_bin`: Bin full, waste spilling
- `missed_collection`: Bin not collected on scheduled date
- `other`: General feedback

---

#### 2. Get All Complaints
**Endpoint:** `GET /api/complaints`  
**Auth Required:** Yes  
**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter (pending, accepted, rejected, fixed)
- `category`: Filter by category
- `severity`: Filter (low, medium, high, critical)

**Response (200 OK):**
```json
{
  "success": true,
  "count": 45,
  "complaints": [
    { ...complaint object 1... },
    { ...complaint object 2... }
  ]
}
```

**Note:** Admins see ALL complaints; users see only their own complaints

---

#### 3. Get Complaint Details
**Endpoint:** `GET /api/complaints/:id`  
**Auth Required:** Yes  

**Response (200 OK):** Single complaint object with all details including statusHistory

---

#### 4. Update Complaint Status (Admin Only)
**Endpoint:** `PUT /api/complaints/:id/status`  
**Auth Required:** Yes  
**Authorization:** Admin only  

**Request Body:**
```json
{
  "status": "accepted",
  "reason": "Ticket accepted. Assigning to bin maintenance team."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "complaint": {
    "complaintId": "cmp-2024-001",
    "status": "accepted",
    "statusHistory": [
      {
        "status": "pending",
        "changedBy": "507f1f77bcf86cd799439011",
        "changedAt": "2024-01-21T14:35:00Z",
        "reason": "Complaint created"
      },
      {
        "status": "accepted",
        "changedBy": "507f1f77bcf86cd799439030",
        "changedAt": "2024-01-21T15:00:00Z",
        "reason": "Ticket accepted. Assigning to bin maintenance team."
      }
    ]
  }
}
```

---

#### 5. Assign Complaint (Admin Only)
**Endpoint:** `PUT /api/complaints/:id/assign`  
**Auth Required:** Yes  
**Authorization:** Admin only  

**Request Body:**
```json
{
  "assignedTo": "507f1f77bcf86cd799439035"  // ObjectId of admin/staff member
}
```

**Response (200 OK):** Updated complaint with assignedTo field

---

### EDUCATION ENDPOINTS

#### 1. Get All Education Content
**Endpoint:** `GET /api/education`  
**Auth Required:** No (only published content visible)  
**Query Parameters:**
- `category`: Filter (waste_segregation, recycling, composting, environmental_impact, general_tips)
- `contentType`: Filter (video, article, infographic)
- `page`, `limit`: Pagination
- `search`: Search by title/tags

**Response (200 OK):**
```json
{
  "success": true,
  "count": 14,
  "content": [
    {
      "_id": "507f1f77bcf86cd799439101",
      "contentId": "edu-001",
      "title": "How to Segregate Waste Properly",
      "description": "Learn the basics of waste segregation...",
      "category": "waste_segregation",
      "contentType": "video",
      "videoURL": "https://www.youtube.com/embed/wJUwcni3cAA",
      "thumbnail": "https://img.youtube.com/vi/wJUwcni3cAA/0.jpg",
      "views": 1240,
      "likes": 345,
      "tags": ["segregation", "waste", "tutorial"],
      "publishedAt": "2024-01-10T00:00:00Z"
    }
  ]
}
```

---

#### 2. Get Education Content Details
**Endpoint:** `GET /api/education/:id`  
**Auth Required:** No  

**Response (200 OK):** Single content object with full details

**Side Effect:** Increments `views` counter on each GET request

---

#### 3. Like/Unlike Content
**Endpoint:** `PUT /api/education/:id/like`  
**Auth Required:** Yes  
**Request Body:**
```json
{
  "liked": true  // true to like, false to unlike
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "contentId": "edu-001",
  "likes": 346,
  "liked": true
}
```

---

### ROUTES ENDPOINTS

#### 1. Get All Routes
**Endpoint:** `GET /api/routes`  
**Auth Required:** Yes  
**Query Parameters:**
- `status`: Filter (planned, in_progress, completed, cancelled)
- `vehicleId`: Filter by vehicle
- `page`, `limit`: Pagination

**Response:** Array of route objects with stops, distance, status

---

#### 2. Get Route Details
**Endpoint:** `GET /api/routes/:id`  
**Auth Required:** Yes  

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439200",
  "routeId": "route-20240121-001",
  "vehicleId": "507f1f77bcf86cd799439001",
  "status": "in_progress",
  "startTime": "2024-01-21T08:00:00Z",
  "distance": 45.3,
  "wasteCollected": 2350,
  "stops": [
    {
      "sequence": 1,
      "binId": "507f1f77bcf86cd799439011",
      "latitude": 13.0827,
      "longitude": 80.2707,
      "status": "completed",
      "arrivedAt": "2024-01-21T08:15:00Z",
      "departedAt": "2024-01-21T08:25:00Z",
      "wasteCollected": 85
    }
  ]
}
```

---

## REAL-TIME FEATURES & SOCKET.IO IMPLEMENTATION

**File:** `backend/src/socket/socketHandler.js`

### Socket Events (Server ↔ Client)

#### 1. User Login (Client → Server)
```javascript
socket.emit('userLogin', userId);
```
- Client emits when user logs in
- Server stores connection: `connectedUsers.set(socket.id, userId)`
- Server joins socket to `user-${userId}` room for user-specific notifications

---

#### 2. Update Vehicle Location (Client → Server)
```javascript
socket.emit('updateVehicleLocation', {
  vehicleId: "507f1f77bcf86cd799439001",
  latitude: 13.0827,
  longitude: 80.2707,
  status: "active"
});
```

**Backend Processing:**
- Validates latitude/longitude are numbers in valid ranges
- Rate limiting: only updates if ≥2 seconds since last update (prevents spam)
- Updates Vehicle model: `currentLocation` + `lastUpdated`
- Broadcasts to all clients

---

#### 3. Vehicle Location Updated (Server → All Clients)
```javascript
// Server broadcasts to all connected clients
io.emit('vehicleLocationUpdated', {
  vehicleId: "507f1f77bcf86cd799439001",
  vehicleNumber: "TN-01-AA-1234",
  driverName: "Ramesh Kumar",
  location: {
    latitude: 13.0827,
    longitude: 80.2707
  },
  status: "active",
  timestamp: "2024-01-21T14:31:25Z"
});
```

- Frontend listening clients receive this and re-render map with new truck position

---

#### 4. Subscribe to Vehicle Updates (Client → Server)
```javascript
socket.emit('subscribeVehicleUpdates', {
  vehicleId: "507f1f77bcf86cd799439001"
});
```

- Client can subscribe to specific vehicle's location stream
- Server joins socket to `vehicle-${vehicleId}` room
- Only clients in that room receive updates (vs. broadcasting to all)

---

#### 5. Subscription Success (Server → Client)
```javascript
socket.emit('subscriptionSuccess', {
  vehicleId: "507f1f77bcf86cd799439001",
  message: "Subscribed to vehicle updates"
});
```

---

#### 6. Location Update Success (Server → Driver)
```javascript
socket.emit('locationUpdateSuccess', {
  vehicleId: "507f1f77bcf86cd799439001",
  timestamp: "2024-01-21T14:31:25Z"
});
```

- Sent to driver's socket after location update processed

---

#### 7. Complaint Status Updates (Server → Client)
```javascript
io.emit('complaintStatusUpdated', {
  complaintId: "cmp-2024-001",
  userId: "507f1f77bcf86cd799439011",
  status: "accepted",
  assignedTo: "507f1f77bcf86cd799439030",
  timestamp: "2024-01-21T15:00:00Z"
});
```

- Notifies user when their complaint status changes
- Can be user-specific via `io.to(`user-${userId}`).emit(...)`

---

## AUTHENTICATION & JWT IMPLEMENTATION

**File:** `backend/config/jwt.js`

**JWT Structure:**
```javascript
{
  header: { alg: 'HS256', typ: 'JWT' },
  payload: {
    userId: "507f1f77bcf86cd799439011",
    email: "user@example.com",
    role: "user",   // 'user' or 'admin'
    iat: 1705788900,
    exp: 1706393700  // 7 days later
  },
  signature: "HMACSHA256(base64(header).base64(payload), JWT_SECRET)"
}
```

**Flow:**
1. User logs in → Controller generates token via `generateToken(payload)`
2. Token stored in client localStorage
3. For protected routes, client sends: `Authorization: Bearer <token>`
4. Backend middleware (`authenticate`) verifies token:
   - Extracts token from `Authorization` header
   - Calls `verifyToken(token)` to decode and validate signature
   - Stores decoded payload in `req.user` for controllers to access

**Token Expiration:** 7 days (configurable via `JWT_EXPIRATION` env var)

---

## MIDDLEWARE PIPELINE

**File:** `backend/src/middleware/*.js`

### 1. Authentication Middleware
```javascript
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: 'Invalid token' });
  
  req.user = decoded;  // Now available in controllers
  next();
};
```

- Must be first middleware on protected routes
- Extracts & validates JWT
- Sets `req.user` with userId, email, role

---

### 2. Authorization Middleware
```javascript
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Forbidden - Required role: ${roles.join(', ')}` });
    }
    next();
  };
};
```

- Placed AFTER authenticate
- Checks `req.user.role` against allowed roles
- Usage: `router.put('/', authenticate, authorize('admin'), updateHandler)`

---

### 3. Rate Limiting Middleware
**File:** `backend/src/middleware/rateLimiter.js`

```javascript
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // Max 100 requests per window per IP
  message: 'Too many requests...'
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // Max 5 login attempts per 15 min
  message: 'Too many login attempts...'
});

export const liveTrackingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,  // Allow frequent polling for live updates
  message: '...'
});

export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 50,  // Max 50 creates per hour
  message: '...'
});
```

**Applied To:**
- `loginLimiter`: `/api/auth/login`
- `apiLimiter`: GET/read endpoints
- `createLimiter`: POST/PUT endpoints (creating complaints, bins, etc.)
- `liveTrackingLimiter`: `/api/logistics/live` (high frequency polling)

---

### 4. File Upload Middleware
**File:** `backend/src/middleware/upload.js`

```javascript
import multer from 'multer';

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 },  // Max 10MB per file
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
```

- Used in complaint creation to validate attachments
- Validates MIME types (images + videos only)
- Max file size: 10MB

---

### 5. Error Handler Middleware
**File:** `backend/src/middleware/errorHandler.js`

```javascript
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err })
  });
};
```

- Global error catcher (placed AFTER all other middleware)
- Handles thrown exceptions in controllers
- Returns consistent error response format

---

## VEHICLE TRACKING & MAP FEATURE DEEP DIVE

### Frontend: VehicleTracking.jsx Architecture

**File:** `frontend/src/pages/VehicleTracking.jsx`

**Polling Mechanism:**
```javascript
useEffect(() => {
  const interval = setInterval(async () => {
    const snapshot = await routeService.getLiveTracking();
    // Update state with new locations, ETAs, etc.
  }, 1000);  // Poll every 1 second
  
  return () => clearInterval(interval);
}, []);
```

- Frontend calls `/api/logistics/live` API every 1000ms
- Gets snapshot of all vehicles, bins, routes, facilities

---

### ETA Calculation Algorithm

**File:** `frontend/src/pages/VehicleTracking.jsx` (Lines 34-90)

**Algorithm:**
1. **Build Route Segments:** Convert polyline (ordered waypoints) into segments
   ```
   segments = [
     { start: [13.08, 80.27], end: [13.09, 80.28], distanceKm: 1.2, cumulativeStartKm: 0, cumulativeEndKm: 1.2 },
     { start: [13.09, 80.28], end: [13.10, 80.29], distanceKm: 1.5, cumulativeStartKm: 1.2, cumulativeEndKm: 2.7 }
   ]
   ```

2. **Project Truck Position:** Find closest point on route to truck's actual location
   - For each segment, compute perpendicular projection
   - Calculate distance from truck to projected point
   - Keep track of segment with shortest distance
   - Return cumulative route distance up to projected point

3. **Calculate Forward Distance**
   ```
   truckProgressKm = 2.4 km (along route)
   totalRouteKm = 45.3 km
   forwardDistanceKm = 45.3 - 2.4 = 42.9 km
   ```

4. **Estimate ETA**
   ```
   truckSpeed = 40 km/h (from vehicle status or API)
   etaMinutes = (42.9 km / 40 km/h) * 60 = 64.35 minutes
   ```

**Why Haversine Formula (not straight-line)?**
- Route follows streets, not aerial path
- Realistic ETA for citizens waiting for collection
- Uses actual road geometry sent by backend

---

### Map Rendering (React-Leaflet)

```javascript
< MapContainer center={[13.0827, 80.2707]} zoom={13}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  
  {/* Facility marker */}
  <Marker position={[facility.lat, facility.lng]} icon={facilityIcon}>
    <Popup>Collection Facility</Popup>
  </Marker>
  
  {/* Route polyline */}
  <Polyline positions={routePath} color="blue" weight={3} />
  
  {/* Bin markers */}
  {bins.map(bin => (
    <Marker position={[bin.lat, bin.lng]} icon={binIcon(bin.fillLevel)}>
      <Popup>{bin.name} - {bin.fillLevel}% full</Popup>
    </Marker>
  ))}
  
  {/* Truck marker */}
  <Marker position={[truck.lat, truck.lng]} icon={truckIcon} draggable={false}>
    <Popup>Driver: {truck.driverName} | ETA: {eta} min</Popup>
  </Marker>
</MapContainer>
```

**Icons:**
- Facility: 🏢 (building emoji)
- Bins: 🗑️ (trash emoji, color-coded by fill %)
  - 0-50%: Green
  - 51-75%: Yellow
  - 76-100%: Red
- Truck: 🚛 (truck emoji)

---

### Backend: Live Tracking API

**Endpoint:** `GET /api/logistics/live`  
**Rate Limit:** liveTrackingLimiter (2000 req/15 min)

**Response (200 OK):**
```json
{
  "success": true,
  "facility": {
    "name": "Chennai Waste Processing Unit",
    "location": { "latitude": 13.0650, "longitude": 80.2700 }
  },
  "routes": [
    {
      "routeId": "route-20240121-001",
      "vehicleId": "v-123",
      "status": "in_progress",
      "path": [
        [13.0827, 80.2707],
        [13.0840, 80.2720],
        [13.0850, 80.2735]
      ],
      "truckPosition": [13.0835, 80.2715],
      "speed": 40,  // kmph
      "stops": [
        {
          "binId": "bin-001",
          "latitude": 13.0827,
          "longitude": 80.2707,
          "status": "completed",
          "wasteCollected": 85
        }
      ]
    }
  ],
  "bins": [
    {
      "binId": "bin-001",
      "latitude": 13.0827,
      "longitude": 80.2707,
      "fillLevel": 65,
      "wasteType": "organic",
      "status": "active"
    }
  ],
  "timestamp": "2024-01-21T14:35:00Z"
}
```

**Backend Processing (Routes Controller):**
- Fetches all routes with status 'planned', 'in_progress'
- For each route: advances truck position based on time elapsed + speed
- Updates stop statuses: if truck near bin (within 50m),mark stop 'completed', reset bin fill level
- Simulates bin fill increase: currentFillLevel += (time elapsed in hours) * 5 % per hour
- Returns complete snapshot for frontend to render

---

## GEOSPATIAL QUERY IMPLEMENTATION

### MongoDB 2dsphere Indexing

**Bin Model:**
```javascript
binSchema.index({ 'location': '2dsphere' });
```

**Vehicle Model:**
```javascript
vehicleSchema.index({ 'currentLocation': '2dsphere' });
```

**Storage Format (GeoJSON):**
```javascript
location: {
  type: 'Point',
  coordinates: [80.2707, 13.0827]  // [LONGITUDE, LATITUDE] - IMPORTANT ORDER
}
```

---

### Nearby Query Implementation

**Location Service:** `backend/src/services/locationService.js`

```javascript
export const getNearbyBins = async (lat, lng, radiusKm = 2, filters = {}) => {
  const query = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: radiusKm * 1000  // Convert km to meters
      }
    }
  };
  
  if (filters.wasteType) query.wasteType = filters.wasteType;
  if (filters.status) query.status = filters.status;
  
  const bins = await Bin.find(query);
  
  // Calculate distance for each bin using Haversine formula
  return bins.map(bin => ({
    ...bin.toObject(),
    distance: calculateDistance(lat, lng, bin.location.coordinates[1], bin.location.coordinates[0]),
    estimatedTimeToReach: Math.round(distance * 12)  // 1 km = 12 min walk
  }));
};
```

**Haversine Distance Formula:**
```javascript
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;  // Earth radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;  // Distance in km
};
```

---

## ENVIRONMENT VARIABLES (.env)

**Backend (.env):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/waste-management
JWT_SECRET=your_super_secret_key_for_signing_tokens
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:3000
BCRYPT_ROUNDS=10
SOCKET_IO_CORS_ORIGIN=http://localhost:3000

# File upload
MULTER_UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB in bytes

# Rate limiting
API_RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
API_RATE_LIMIT_MAX=100
LOGIN_RATE_LIMIT_MAX=5
CREATE_RATE_LIMIT_MAX=50
LIVE_TRACKING_RATE_LIMIT_MAX=2000
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=Waste Management System
VITE_APP_VERSION=1.0.0
```

---

## DEPLOYMENT ARCHITECTURE

### Docker Compose Setup
**File:** `deployment/docker-compose.yml`

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  backend:
    build:
      context: ./backend
      dockerfile: ../deployment/Dockerfile.backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      MONGODB_URI: mongodb://admin:password@mongodb:27017/waste-management
      NODE_ENV: production
    volumes:
      - ./backend:/app

  frontend:
    build:
      context: ./frontend
      dockerfile: ../deployment/Dockerfile.frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./deployment/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - backend

volumes:
  mongodb_data:
```

### Nginx Reverse Proxy
**File:** `deployment/nginx.conf`

```nginx
upstream backend {
  server backend:5000;
}

upstream frontend {
  server frontend:3000;
}

server {
  listen 80;
  server_name localhost;

  # Static frontend
  location / {
    proxy_pass http://frontend;
  }

  # Backend API
  location /api {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  # WebSocket
  location /socket.io {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

---

## DATABASE SEED DATA

**File:** `backend/seedEducation.js` (14 videos pre-seeded)

**Categories:**
1. **Waste Segregation** (3 videos): Proper sorting, source segregation, kitchen waste
2. **Recycling** (4 videos): General recycling, plastic, paper, e-waste
3. **Composting** (3 videos): Home composting, vermicomposting, best practices
4. **Environmental Impact** (4 videos): Waste impact, plastic pollution, climate change, zero waste

All videos have YouTube URLs, thumbnails cached, views=0, likes=0, published=true

---

## SECURITY MEASURES

1. **Password Security:**
   - Bcryptjs hashing with 10 salt rounds
   - Passwords stored never as plain text
   - Passwords NOT selected by default in queries (select: false)

2. **JWT Authentication:**
   - Tokens signed with JWT_SECRET
   - 7-day expiration
   - Verified on every protected endpoint

3. **Authorization:**
   - Role-based access control (user vs. admin)
   - Admin-only routes protected with `authorize('admin')` middleware

4. **CORS:**
   - Only allow requests from frontend origin
   - Configurable via CORS_ORIGIN env var

5. **Helmet:**
   - Sets HTTP security headers (Content-Security-Policy, X-Frame-Options, etc.)

6. **Rate Limiting:**
   - Login: 5 attempts per 15 minutes
   - API: 100 requests per 15 minutes
   - Create: 50 per hour
   - Live tracking: 2000 per 15 min (for polling)

7. **File Upload Validation:**
   - MIME type checking (images + videos only)
   - Max file size: 10MB
   - Multer prevents directory traversal attacks

8. **Input Validation:**
   - Coordinates range checked (-90 to 90 lat, -180 to 180 lng)
   - Enum values enforced on status, category, role fields
   - Email regex validation

---

## INTEGRATION POINTS & DATA FLOWS

### User Registration & Login Flow
```
User submits form (Frontend)
    ↓
POST /api/auth/register (with loginLimiter, no auth required)
    ↓
Backend validates & checks duplicate email
    ↓
Password hashed via bcryptjs pre-save middleware
    ↓
User saved to MongoDB
    ↓
JWT token generated
    ↓
Token returned to frontend & stored in localStorage
```

### Complaint Filing Flow
```
User opens complaint form, selects category, adds description + image
    ↓
POST /api/complaints (with createLimiter, auth required)
    ↓
Multer middleware validates image (MIME type, size)
    ↓
File uploaded, complaint document created in MongoDB
    ↓
complaintId generated (UUID)
    ↓
Initial status: 'pending', statusHistory initialized
    ↓
Response sent to frontend with complaint details
```

### Admin Complaint Resolution
```
Admin views /api/complaints?status=pending
    ↓
Selects complaint, clicks "Accept"
    ↓
PUT /api/complaints/:id/status with status="accepted"
    ↓
Backend updates status, adds to statusHistory
    ↓
Socket.IO emits 'complaintStatusUpdated' to original user
    ↓
User's frontend notifies them of status change
```

### Vehicle Tracking Update Loop
```
Driver updates location every ~5-10 seconds via Socket.IO
    ↓
Socket event: 'updateVehicleLocation' sent to server
    ↓
Server validates coords, checks rate limit (≥2 sec since last)
    ↓
Vehicle document updated in MongoDB
    ↓
Server broadcasts 'vehicleLocationUpdated' to all clients
    ↓
User's VehicleTracking page receives update
    ↓
Map re-renders with new truck position
    ↓
ETA recalculated for next waypoint
    ↓
Bin near truck (within 50m)? Mark stop as 'completed', reset bin fill
```

---

## COMMON VIVA QUESTIONS & DETAILED ANSWERS

**Q: What database indexing did you use and why?**  
A: We use MongoDB 2dsphere geospatial indexes on `Bin.location` and `Vehicle.currentLocation` fields, stored as GeoJSON Points [longitude, latitude]. This enables efficient $near queries for "nearby bins/vehicles" using Haversine distance calculations without scanning entire collection.

**Q: How is vehicle location updated in real-time?**  
A: Vehicles can update location via REST API (`PUT /api/vehicles/:id/location`) or Socket.IO (`updateVehicleLocation` event). Updates are rate-limited to 2-second intervals to prevent spam. Backend broadcasts changes via Socket.IO to all connected clients, while REST API polling hits `/api/logistics/live` every 1 second for live tracking page.

**Q: How do you calculate ETA for next bin?**  
A: Frontend projects truck's actual position onto route geometry using perpendicular projection on each segment. Once we know how far the truck has progressed (e.g., 2.4 km of 45 km route), we calculate remaining distance (42.6 km) and divide by estimated speed (40 km/h average) to get ETA in minutes. This uses actual route geometry, not straight-line distance.

**Q: What happens when a truck passes near a bin?**  
A: Backend checks distance between truck and each pending stop. When distance < 50m, stop status updates to 'completed', bin's currentFillLevel resets to 0, and wasteCollected added to route totals. Frontend sees this change and updates map UI.

**Q: How do rate limiters work?**  
A: express-rate-limit middleware tracks requests by IP address in 15-min windows. Login endpoint allows 5 attempts, general API allows 100, creation endpoints allow 50/hour, and live tracking allows 2000/15min for frequent polling. Excess requests return 429 Too Many Requests with backoff message.

---

**Generated for:** Project Viva & Faculty Technical Review  
**Last Updated:** April 1, 2026  
**Completeness:** 100% Full Technical Documentation  
**Status:** Ready for Advanced Questioning
