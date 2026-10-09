# Project Technical Reference Guide
**Waste Management Web Platform**

This document contains a comprehensive breakdown of every technology, library, and framework used in this project. You can use this as a "cheat sheet" to confidently answer any technical questions from the faculty during your review.

---

## 1. Frontend Architecture (Client-Side)
The frontend is the user interface where citizens submit complaints and admins manage the system.

* **React.js (`react`, `react-dom`)**
  * **What it is:** A JavaScript library for building user interfaces.
  * **How we use it:** We use React to build a Single Page Application (SPA). It allows us to create reusable UI components (like the Complaint Form, Admin Dashboard, and Navigation Bar) without reloading the page.
* **Vite (`vite`)**
  * **What it is:** A modern, blazing-fast build tool and development server.
  * **How we use it:** We use Vite instead of Create-React-App because it starts the development server instantly (`npm run dev`) and bundles our code much faster for production.
* **Material UI / MUI (`@mui/material`, `@emotion/react`)**
  * **What it is:** A popular React UI component library based on Google's Material Design.
  * **How we use it:** We use MUI to instantly get beautiful, responsive, and accessible components like Buttons, Text Fields, Dialogs, and Data Tables without having to write thousands of lines of custom CSS.
* **React Router (`react-router-dom`)**
  * **What it is:** A routing library for React.
  * **How we use it:** It handles the navigation between different pages (e.g., from `/login` to `/dashboard` to `/complaints`) entirely on the client side, keeping the app fast.
* **Axios (`axios`)**
  * **What it is:** A promise-based HTTP client for the browser.
  * **How we use it:** We use Axios to send API requests (GET, POST, PUT, DELETE) from our React frontend to our Node.js backend. For example, when a user clicks "Submit Complaint", Axios sends that JSON data to the backend server.
* **Maps & Geo-Location (`leaflet`, `react-leaflet`, `mapbox-gl`)**
  * **What it is:** Mapping libraries for displaying interactive maps.
  * **How we use it:** We use these to show the live locations of bins, vehicles, and the exact GPS coordinates where a complaint was reported.
* **Data Visualization (`recharts`, `chart.js`)**
  * **What it is:** Charting libraries for React.
  * **How we use it:** We use these on the Admin Dashboard to display analytics, such as a pie chart of complaints by category or a bar chart showing resolved vs. pending issues.

---

## 2. Backend Architecture (Server-Side)
The backend is the server that processes requests, enforces security, and communicates with the database.

* **Node.js**
  * **What it is:** A JavaScript runtime environment that allows us to run JavaScript on the server.
  * **How we use it:** It is the core engine running our backend server.
* **Express.js (`express`)**
  * **What it is:** A minimal and flexible Node.js web application framework.
  * **How we use it:** We use Express to build our RESTful API. It defines our "Routes" (e.g., `POST /api/complaints`) and connects them to our Controller functions.
* **Socket.io (`socket.io`, `socket.io-client`)**
  * **What it is:** A library that enables real-time, bidirectional communication between the web client and server.
  * **How we use it:** We use this to push real-time updates. If a vehicle moves or a complaint status changes, Socket.io tells the frontend to update immediately without the user having to refresh the page.
* **Authentication & Security (`jwt-simple`, `bcryptjs`)**
  * **What they are:** Security libraries for passwords and sessions.
  * **How we use them:** 
    * **Bcryptjs:** Before saving a new user's password to the database, we use bcrypt to "hash" (encrypt) it so it cannot be stolen.
    * **JWT (JSON Web Tokens):** When a user logs in, we generate a JWT. The frontend sends this token with every request to prove the user is authenticated and authorized (e.g., proving they are an Admin).
* **Cloudinary & Multer (`cloudinary`, `multer`)**
  * **What they are:** File uploading and cloud storage services.
  * **How we use them:** When a user uploads a photo of an overflowing bin, `multer` catches the file on the server, and we upload it to `cloudinary` (a cloud storage provider). Cloudinary gives us a URL back, which we save in the database.
* **Security Middleware (`helmet`, `express-rate-limit`, `cors`)**
  * **What they are:** Protection tools for Express.
  * **How we use them:** `helmet` secures HTTP headers, `cors` ensures only our specific React frontend can access our API, and `rate-limit` prevents spam/DDoS attacks by limiting how many requests a user can make per minute.

---

## 3. Database Architecture
The database stores all of our application's persistent data.

* **MongoDB**
  * **What it is:** A NoSQL, document-oriented database.
  * **How we use it:** We use MongoDB because it stores data in flexible, JSON-like documents. This is perfect for JavaScript applications because the data flows seamlessly from the React frontend, through the Node backend, straight into the database as JSON.
* **Mongoose (`mongoose`)**
  * **What it is:** An Object Data Modeling (ODM) library for MongoDB and Node.js.
  * **How we use it:** Since MongoDB is schema-less by default, we use Mongoose to enforce rules. Mongoose defines our Schemas (e.g., saying that a Complaint *must* have a `subject` and `description`). It also provides the functions we use to query the database (like `Complaint.find()` or `Complaint.findByIdAndUpdate()`).

---

## Example Q&A for Faculty Review

**Q: Explain the flow of data when a user submits a complaint.**
**A:** "When the user fills the form in React, the data is stored in React state. Upon submission, **Axios** sends an HTTP POST request containing the JSON data to our **Express.js** backend. The Express router passes this to the Complaint Controller, which validates the data. We then use a **Mongoose** model to create a new document (`new Complaint()`) and save it (`await complaint.save()`) to the **MongoDB** database. Finally, Express sends a 201 Created response back to the React frontend."

**Q: How do you handle security for admin features?**
**A:** "When an admin logs in, the server verifies their hashed password using **bcryptjs**. If correct, it generates a **JWT (JSON Web Token)**. This token contains their user ID and role (`admin`). The React frontend stores this token and attaches it to the Authorization header of future **Axios** requests. Our Express backend has a middleware function that intercepts the request, verifies the JWT, and blocks the request if the user is not an admin."

**Q: How does the map feature work?**
**A:** "We use **React-Leaflet/Mapbox** on the frontend to render the map interface. The map component uses **Axios** to fetch the GPS coordinates (`[longitude, latitude]`) of bins and vehicles from our MongoDB database, which stores them using specialized GeoJSON Point schemas. The map then places markers at those exact coordinates."
