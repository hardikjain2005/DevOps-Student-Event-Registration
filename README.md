# Event Registration System

A modern, full-stack event registration application with MongoDB Atlas backend and responsive frontend.

## 🚀 Live Demo

- **Frontend**: [GitHub Pages](https://hardikjain2005.github.io/Student-Event-Registration-DEVOPS/)
- **Backend**: Deploy to Render

## 📋 Features

- Student event registration
- Real-time admin dashboard
- MongoDB Atlas database
- Modern, responsive UI
- RESTful API

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript
- Responsive design
- Modern UI/UX

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- RESTful API
- CORS enabled

## 📦 Installation

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
MONGO_URI=your_mongodb_atlas_connection_string
PORT=3000
```

Run locally:
```bash
npm start
```

### Frontend Setup

Simply open `frontend/index.html` in a browser or serve via any HTTP server.

## 🌐 Deployment

### Backend (Render.com)

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Environment**: Add `MONGO_URI` variable
4. Deploy!

### Frontend (GitHub Pages)

1. Push `docs` folder to GitHub
2. Go to Settings → Pages
3. Select `main` branch and `/docs` folder
4. Save

**Important**: Update `API_URL` in `docs/index.html` to your Render backend URL.

## 📝 Environment Variables

- `MONGO_URI` - MongoDB Atlas connection string
- `PORT` - Server port (default: 3000)

## 🤝 Contributing

Pull requests are welcome!

## 📄 License

MIT
