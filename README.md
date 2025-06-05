# 🎉 Event Manager

A modern, full-stack event management platform built with React TypeScript and Node.js. Create, discover, and manage events with a beautiful, responsive interface.

## 🚀 Live Demo

**Frontend:** [https://event-manager-frontend-ruby.vercel.app](https://event-manager-frontend-ruby.vercel.app)  
**Backend API:** [https://event-manager-backend-smoky.vercel.app](https://event-manager-backend-smoky.vercel.app)

> **Demo:** Create your own account or use demo@example.com / demo123

## 📸 Screenshots

| Dashboard | Login | Signup | Create Event |
|-----------|-------|--------|--------------|
| ![Dashboard](screenshots/dashboard.png) | ![Login](screenshots/login.png) | ![Signup](screenshots/signup.png) | ![Create](screenshots/create.png) |

## ✨ Features

### 🔐 **Authentication**
- User registration and login with JWT tokens
- Secure password hashing with bcrypt
- Protected routes and session persistence

### 📅 **Event Management**
- Create events with title, description, location, and date
- Upload and manage event images with Cloudinary
- View all events in a responsive grid layout
- Edit and delete your own events

### 🎨 **Modern UI**
- Clean, elegant design with Tailwind CSS
- Fully responsive (mobile, tablet, desktop)
- Loading states and error handling

## 🛠️ Tech Stack

**Frontend:** React 18, TypeScript, Tailwind CSS, Vite  
**Backend:** Node.js, Express, TypeScript, PostgreSQL  
**Cloud:** Vercel (hosting), Cloudinary (images)  
**Auth:** JWT, bcryptjs

## 🏃‍♀️ Quick Start

1. **Clone repository**
   ```bash
   git clone https://github.com/rada-ii/event-manager.git
   cd event-manager
   ```

2. **Backend setup**
   ```bash
   cd backend
   npm install
   npm run dev  # http://localhost:3000
   ```

3. **Frontend setup** (new terminal)
   ```bash
   cd frontend
   npm install  
   npm run dev  # http://localhost:5173
   ```

## 🔧 Environment Variables

**Backend (.env):**
```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000
```

## 📚 API Endpoints

```
Authentication:
POST /users/signup    # Register user
POST /users/login     # Login user

Events:
GET  /events          # Get all events
POST /events          # Create event (auth)
PUT  /events/:id      # Update event (owner)
DELETE /events/:id    # Delete event (owner)
GET  /events/my       # Get user's events

Health:
GET  /health          # API health check
```

## 🚀 Deployment

Both frontend and backend are deployed on **Vercel** with automatic deployments from the main branch.

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection protection
- File upload validation
- CORS configuration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push and create Pull Request

## 📬 Contact

**Author:** Rada Ivanković  
**GitHub:** [@rada-ii](https://github.com/rada-ii)  
**Email:** ra.da@live.com  
**LinkedIn:** [Rada Ivanković](https://www.linkedin.com/in/rada-ivankovi%C4%87-52621b74/)

---

⭐ **Star this repo if you found it helpful!**
