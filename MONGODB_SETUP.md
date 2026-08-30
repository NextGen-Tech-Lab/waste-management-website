# MongoDB Setup Guide for EcoManage Backend

## Option 1: MongoDB Atlas (Recommended - Cloud Version, Free)

MongoDB Atlas is a free cloud-hosted MongoDB service that's easy to set up.

### Steps:

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas/register
2. **Create a Free Account**
   - Sign up with email
   - Create an organization and project
   - Choose "Free" tier plan

3. **Create a Database Cluster**
   - Click "Create a Cluster"
   - Choose "M0 Free" tier
   - Select your preferred region
   - Click "Create"

4. **Create Database User**
   - Go to "Database Access" tab
   - Click "Add New Database User"
   - Username: `ecocareuser`
   - Password: `EcoCare@123456`
   - Click "Add User"

5. **Add IP Address to Whitelist**
   - Go to "Network Access" tab
   - Click "Add IP Address"
   - Select "Add Current IP Address" (or add 0.0.0.0/0 for development)
   - Click "Confirm"

6. **Get Connection String**
   - Go to "Databases" tab
   - Click "Connect" on your cluster
   - Choose "Connect application"
   - Copy the connection string
   - Replace <username> and <password> with your credentials
   - Replace <cluster-name> with your actual cluster name

7. **Update .env file**
   - Open `backend/.env`
   - Replace the MONGODB_URI with your connection string
   - Example:
     ```
     MONGODB_URI=mongodb+srv://ecocareuser:EcoCare@123456@cluster0.mongodb.net/waste-management?retryWrites=true&w=majority
     ```

8. **Start the Backend**
   - Run: `npm seed` (creates test users)
   - Run: `npm start`

---

## Option 2: Local MongoDB (Advanced)

If you prefer local MongoDB:

1. **Download and Install MongoDB Community**
   - https://www.mongodb.com/try/download/community
   - Run the installer
   - Default port: 27017

2. **Update .env file**
   ```
   MONGODB_URI=mongodb://localhost:27017/waste-management
   ```

3. **Start MongoDB Service**
   - On Windows: `mongod` (in command prompt/PowerShell)
   - Keep it running in a separate terminal

4. **Start Backend in another terminal**
   - Run: `npm seed`
   - Run: `npm start`

---

## Option 3: Use Provided Demo Connection (If Available)

We've set up a demo MongoDB Atlas cluster for testing. Contact the development team for credentials.

---

## Test Credentials After Setup

Once MongoDB is connected and seeded, use these accounts:

**Admin Account:**
- Email: `admin@example.com`
- Password: `1234`
- Role: Administrator

**Regular User Account:**
- Email: `user@example.com`
- Password: `1234`
- Role: User

---

## Troubleshooting

### Connection Refused
- Make sure MongoDB service is running
- Check if port 27017 is open (local) or IP is whitelisted (Atlas)

### Authentication Failed
- Verify username and password in connection string
- Check that database user exists in MongoDB Atlas

### No Module Found Error
- Run: `npm install` in backend folder
- Run: `npm seed` to create collections

---

**Admin Contact**: For production deployment and additional configuration, contact the backend team.
