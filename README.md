# 🚀 DevConnect — Developer Networking Platform

DevConnect is a **backend-first developer networking platform** inspired by Tinder-style matching, built to help developers connect, collaborate, and grow together.  
The project focuses on **clean API design, authentication, scalability, and real-world backend practices**.

> This project is intentionally built **the production way** — not as a demo.

---

## ✨ Key Features

- 🔐 **JWT-based Authentication**
  - Secure signup & login
  - Protected routes and authorization middleware

- 🤝 **Connection Request System**
  - Send / accept / reject connection requests
  - Prevents duplicate and invalid requests
  - Real-time status handling

- 🧠 **Smart Developer Feed**
  - Filtered user feed excluding self & existing connections
  - Optimized MongoDB queries with indexing

- ⚡ **Scalable & Performant APIs**
  - Pagination for large datasets
  - Rate limiting to prevent abuse
  - Clean REST API structure

- 🛡️ **Production-Ready Backend Practices**
  - Input validation
  - Centralized error handling
  - Secure environment variable management

---

## 🧑‍💻 Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** JWT  
- **Security & Performance:** Rate Limiting, Indexing  
- **Tools:** Git, GitHub, Postman  

---

## 📁 Project Structure

DevConnect/
├── src/
│ ├── controllers/ # Business logic
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ ├── middlewares/ # Auth, validation, rate limiting
│ ├── utils/ # Helper utilities
│ └── app.js # App configuration
├── .env.example
├── package.json
└── README.md  


---

## 🔑 API Highlights

| Method | Endpoint | Description |
|------|---------|------------|
| POST | `/signup` | User registration |
| POST | `/login` | User authentication |
| GET | `/feed` | Developer feed |
| POST | `/request/send/:id` | Send connection request |
| POST | `/request/review/:id` | Accept / Reject request |
| GET | `/user/connections` | View all connections |

---

## 📈 Performance & Scalability

- Handles **1K+ API requests/day**
- MongoDB compound indexing improved feed performance by **~45%**
- Pagination reduces payload size and response time
- Rate limiting protects APIs from abuse

---

## 🧪 Validation & Reliability

- Schema-level validations using Mongoose
- Centralized error handling for consistent API responses
- Clean separation of concerns (controllers, routes, services)

---

## 🚀 Getting Started
 1️⃣ Clone the repository
```bash
git clone https://github.com/Anas2604-web/DevConnect.git
cd DevConnect

2️⃣ Install dependencies
npm install

3️⃣ Setup environment variables

Create a .env file using .env.example:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

4️⃣ Run the server
npm start


Server will start at:

http://localhost:5000
