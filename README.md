# College Commerce

Full-stack student marketplace built with React, Tailwind CSS, Node.js, Express, MongoDB, JWT, and Socket.io.

## Features

- Student authentication with JWT
- Product listings for buy, sell, rent, and services
- Search, filter, and sorting
- Real-time chat with Socket.io
- Order simulation and order history
- Seller reviews and ratings
- Notifications for chat and order activity
- Admin dashboard for user and listing moderation
- Stylish responsive UI with nearby and discount sections
- Seeded dummy data for demo use

## Demo Accounts

- Admin: `aarav@college.edu` / `password123`
- User: `siya@college.edu` / `password123`
- User: `rohan@college.edu` / `password123`

## Setup

### Backend

1. Open `backend`.
2. Copy `.env.example` to `.env`.
3. Run `npm install`.
4. Run `npm run dev`.

### Frontend

1. Open `frontend`.
2. Copy `.env.example` to `.env`.
3. Run `npm install`.
4. Run `npm run dev`.

## Environment Variables

### Backend `.env`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/college-commerce
JWT_SECRET=supersecret123
JWT_EXPIRES_IN=30d
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Notes

- The backend auto-seeds sample users, products, reviews, orders, messages, and notifications on first run when the database is empty.
- Use MongoDB locally before starting the backend.
