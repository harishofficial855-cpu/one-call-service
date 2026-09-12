# One Call Service - Full Stack Web Application

A complete, production-ready MERN stack web application for booking home services online.

## 📋 Project Overview

One Call Service is a home services booking platform where:
- **Customers** can browse, book, and pay for various home services
- **Service Providers** can accept bookings and manage their services
- **Admins** can manage users, services, and view analytics

## 🏗️ Project Structure

```
one-call-service/
├── backend/               # Node.js Express API
│   ├── models/           # MongoDB schemas
│   ├── controllers/      # Business logic
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & error handling
│   ├── config/           # Database config
│   ├── server.js         # Express server
│   ├── seed.js           # Database seeding
│   ├── .env              # Environment variables
│   └── package.json      # Dependencies
│
└── frontend/              # React Vite application
    ├── src/
    │   ├── pages/        # React pages/components
    │   ├── components/   # Reusable components
    │   ├── services/     # API calls
    │   ├── store/        # Zustand state management
    │   ├── App.jsx       # Main app component
    │   └── main.jsx      # Entry point
    ├── .env              # Frontend configuration
    └── package.json      # Dependencies
```

## 🛠️ Technology Stack

### Backend
- **Node.js** with **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Zustand** - State management
- **Tailwind CSS** - Styling

## 📦 Prerequisites

Before running the application, ensure you have:
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (v4.4 or higher) - Running locally or MongoDB Atlas

## 🚀 Installation & Setup

### 1. Clone/Setup Project

```bash
cd "one call service"
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Open `backend/.env` and update:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/one-call-service
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173
```

#### Initialize Database
```bash
# Seed sample data
npm run seed
```

#### Start Backend Server
```bash
npm run dev
```

The backend will start at: **http://localhost:5000**

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Configure Environment Variables
Open `frontend/.env` and verify:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=One Call Service
```

#### Start Frontend Dev Server
```bash
npm run dev
```

The frontend will start at: **http://localhost:5173**

## 📱 Features Implemented

### Customer Features
- ✅ Browse services by category
- ✅ Search services
- ✅ View service details and reviews
- ✅ Book services (3-step wizard)
- ✅ View booking history
- ✅ Track booking status
- ✅ Rate and review services
- ✅ Customer dashboard
- ✅ Profile management

### Provider Features
- ✅ Accept/reject bookings
- ✅ View assigned bookings
- ✅ Update booking status
- ✅ View earnings
- ✅ Profile management
- ✅ Provider dashboard

### Admin Features
- ✅ View dashboard statistics
- ✅ Manage customers
- ✅ Manage providers
- ✅ Verify providers
- ✅ Manage services
- ✅ View all bookings
- ✅ Manage offers

### Public Features
- ✅ Homepage with service preview
- ✅ Service catalog with filtering
- ✅ Offers page
- ✅ About page
- ✅ Contact page
- ✅ Responsive design

## 🔐 Default Credentials

### Admin Account
```
Email: admin@onecallservice.com
Password: Admin123
Role: Admin
```

### Test Customer
Create a new account during registration with role "customer"

### Test Provider
Create a new account during registration with role "provider"

## 🧪 Testing Workflows

### Customer Flow
1. Register as customer
2. Browse services on `/services`
3. Click "View Details" on any service
4. Click "Book Now" to start booking
5. Follow 3-step booking wizard
6. View booking confirmation
7. Go to `/my-bookings` to see booking history
8. Visit `/dashboard` to see customer dashboard

### Provider Flow
1. Register as provider
2. Visit `/provider/dashboard`
3. Accept/reject new bookings
4. Update booking status
5. View earnings and ratings

### Admin Flow
1. Login as admin
2. Visit `/admin/dashboard`
3. View statistics
4. Manage users and services

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service details
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/my-bookings` - Get my bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings` - Get all bookings (admin)

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/service/:serviceId` - Get service reviews
- `GET /api/reviews/provider/:providerId` - Get provider reviews

### Other Endpoints
- `GET /api/locations` - Get serviceable locations
- `POST /api/payments` - Create payment
- `GET /api/notifications/my-notifications` - Get notifications
- `POST /api/complaints` - Create complaint
- `GET /api/offers` - Get active offers
- `GET /api/admin/stats` - Get admin dashboard stats

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev        # Start with nodemon
npm run build      # Build for production
npm run start      # Start production server
```

### Frontend Development
```bash
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 📊 Database Schema

### Collections
- **Users** - Customers, providers, admins
- **Services** - Available services
- **Bookings** - Service bookings
- **Locations** - Serviceable areas
- **Reviews** - Service ratings & feedback
- **Payments** - Payment transactions
- **Notifications** - User notifications
- **Complaints** - Support complaints
- **Offers** - Promotional offers
- **Providers** - Provider profiles
- **Subscriptions** - User subscriptions

## 🚀 Deployment

### Backend Deployment (Render)
1. Push code to GitHub
2. Connect Render to GitHub
3. Create new web service
4. Set environment variables
5. Deploy

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Connect Vercel to GitHub
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Set environment variables
5. Deploy

### Database (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB is accessible on port 27017

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
- Check if backend server is running

### API Errors
- Check backend console for error logs
- Verify all environment variables are set
- Ensure all required fields are provided in requests

### Frontend Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 📝 License

This project is proprietary and confidential.

## 👥 Support

For issues and questions, please contact: support@onecallservice.com

---

**Status**: ✅ Complete and Ready for Development/Deployment
**Last Updated**: 2024
**Version**: 1.0.0
