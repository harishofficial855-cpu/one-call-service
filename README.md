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
Copy `backend/.env.example` to `backend/.env`, then set:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/one-call-service
JWT_SECRET=generate-a-long-random-secret
JWT_EXPIRE=1d
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=your-initial-bcrypt-hash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_smtp_password
```

Generate the JWT secret and bcrypt password hash locally from the `backend` directory:
```bash
node -e "console.log(require('node:crypto').randomBytes(64).toString('hex'))"
node -e "const readline=require('node:readline/promises'); const rl=readline.createInterface({input:process.stdin,output:process.stdout}); rl.question('Admin password: ').then(password=>require('bcryptjs').hash(password,12)).then(console.log).finally(()=>rl.close())"
```
Use a unique password with at least 12 characters. Put the hash (not the
plaintext password) in `ADMIN_PASSWORD_HASH`. Never put backend secrets in
frontend environment variables or commit a real `.env` file.

If MongoDB Atlas SRV lookups fail with `ECONNREFUSED`, you can set
`MONGODB_DNS_SERVERS=8.8.8.8,8.8.4.4` to use explicit DNS resolvers. Only set
this when your system's configured DNS resolver cannot resolve the Atlas SRV
record.

#### Initialize Database
```bash
# Optional: local development only; this clears existing users/services/locations/offers.
npm run seed
```
The seed script does not create an admin user. Admin credentials are configured
through the environment variables above.

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
Copy `frontend/.env.example` to `frontend/.env` and set:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
The GA4 measurement ID is public. Admin passwords, password hashes, JWT secrets,
and database URLs belong only in the backend environment.

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
- ✅ Private `/admin` dashboard with environment-backed login
- ✅ Date-filtered page-view and provider-contact reports
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

## 🔐 Admin Login

There are no default admin credentials. Visit `/admin` and sign in using the
`ADMIN_EMAIL` and password corresponding to `ADMIN_PASSWORD_HASH`. The first
admin login attempt or matching reset request initializes a private MongoDB
`admincredentials` record from that bcrypt hash. After initialization, that
database hash is authoritative, so password resets persist across Render
restarts; keep a valid `ADMIN_PASSWORD_HASH` configured as the bootstrap value.
The `/api/admin/login` endpoint verifies the password with bcrypt and issues a
short-lived JWT. Use a unique password with at least 12 characters. Public
registration cannot create admin-role accounts.

### Admin Password Reset

The admin sign-in page links to `/admin/forgot-password`. Configure working
SMTP credentials on the backend using `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`,
and `SMTP_PASSWORD`; port 465 uses implicit TLS, while other ports use standard
SMTP transport security. The sender address is `SMTP_USER`. The application
does not report a reset code as sent when SMTP is missing or delivery fails.

The backend stores only a bcrypt hash of each randomly generated code. Codes
expire after 10 minutes, are invalidated after five failed verification
attempts, and can be used once. Requests have a one-minute cooldown and a
five-per-hour cap per admin account; endpoints are also rate limited by client
IP (per running backend instance). The reset request response is intentionally
generic to reduce account enumeration. Passwords must be 12–128 characters. Do
not log or share reset codes, passwords, or database credential records.

To test locally, run the backend with a reachable MongoDB database and valid
SMTP settings, then run the frontend with `VITE_API_URL=http://localhost:5000/api`.
Open `http://localhost:5173/admin`, select **Forgot Password?**, request a code
for `ADMIN_EMAIL`, and complete the email/code/new-password form. Verify that
the new password signs in and the previous password no longer does. Also check
that a wrong code is rejected and five failed code attempts invalidate that
code. On Render, set the SMTP variables only in the backend environment and
redeploy; on Vercel, keep only frontend variables such as `VITE_API_URL`.
Confirm actual message delivery using the configured provider before relying
on password reset in production.

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
2. Visit `/admin`
3. View statistics
4. Manage users and services
5. If locked out, use **Forgot Password?** and complete the emailed-code flow

## 🌐 API Endpoints

### Admin and Tracking
- `POST /api/admin/login` - Environment-backed admin login (rate limited)
- `POST /api/admin/password-reset/request` - Request an email reset code (rate limited)
- `POST /api/admin/password-reset/confirm` - Verify the code and set a new password (rate limited)
- `GET /api/admin/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD` - Admin-only analytics report
- `POST /api/tracking/events` - Public, validated and rate-limited event collection

The tracking endpoint accepts only page views and provider `call`/`whatsapp`
button clicks. It stores an event ID, service/provider-card ID, action, page
path, and server timestamp; it does not accept phone numbers or message
contents. Event IDs have a unique MongoDB index so retries are idempotent.
Contact totals mean button clicks only, not calls actually connected, WhatsApp
messages sent, or bookings completed. GA4 SPA page views use
`VITE_GA_MEASUREMENT_ID`; MongoDB reports are stored by the backend.

### Required Environment Variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Render/backend | MongoDB Atlas connection string |
| `JWT_SECRET` | Render/backend | Signs existing user and admin JWTs; use a long random value |
| `ADMIN_EMAIL` | Render/backend | Dedicated admin login email |
| `ADMIN_PASSWORD_HASH` | Render/backend | Initial bcrypt hash used to bootstrap the MongoDB admin credential; never plaintext |
| `SMTP_HOST` | Render/backend | SMTP server hostname for reset emails |
| `SMTP_PORT` | Render/backend | SMTP server port (465 for implicit TLS; commonly 587 for STARTTLS) |
| `SMTP_USER` | Render/backend | SMTP username and reset-email sender address |
| `SMTP_PASSWORD` | Render/backend | SMTP password or provider app password |
| `FRONTEND_URL` | Render/backend | Production Vercel origin allowed by CORS |
| `VITE_API_URL` | Vercel/frontend build | Render API URL ending in `/api` |
| `VITE_GA_MEASUREMENT_ID` | Vercel/frontend build | Optional GA4 measurement ID override (`G-...`); otherwise the existing property is retained |

`PORT` is supplied by Render in production; `JWT_EXPIRE` defaults to one day
for admin tokens. SMTP settings are required for password reset email; payment,
AWS, and DNS settings are only needed where existing application features use
them.

### Deployment

**Vercel**
1. Keep the existing Vercel SPA rewrite/build configuration and deploy the
   existing frontend project; do not create a second frontend.
2. Add `VITE_API_URL=https://<your-render-service>.onrender.com/api` and
   `VITE_GA_MEASUREMENT_ID=G-...` in Vercel project environment variables
   (Production and Preview as appropriate). These `VITE_` values are bundled
   into the public frontend; never add passwords or signing/database secrets.
3. Redeploy after changing build environment variables.

**Render**
1. Keep the existing Node/Express service, set its root directory to `backend`,
   build command to `npm install`, and start command to `npm start`.
2. Configure `MONGODB_URI`, a new random `JWT_SECRET`, `JWT_EXPIRE=1d`,
   `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`,
   `SMTP_PASSWORD`, `FRONTEND_URL` (the exact Vercel production origin), and
   `NODE_ENV=production` in the Render environment. Use your mail provider's
   approved SMTP credentials; never use a personal account password where an
   app password or service credential is supported.
   Do not run the destructive seed script against production.
3. Deploy and verify `GET /api/health`, then visit `/admin` and verify the
   admin login and analytics report. To verify email reset, request a code
   using the configured admin email and confirm delivery before relying on the
   feature in production.

**Security checks**
- `GET /api/admin/analytics` without a JWT returns `401`; a non-admin JWT
  returns `403`.
- Invalid event shapes and invalid date ranges are rejected; repeated event IDs
  do not create duplicate records. Public event collection is capped at 30
  requests per IP per minute, and admin login at 10 attempts per IP per 15
  minutes (in-memory limits apply per running backend instance).
- Do not log or send customer phone numbers or WhatsApp message contents as
  analytics parameters. Contact tracking is fire-and-forget so it must not
  delay the `tel:` or WhatsApp link.
- If the database contains an old seeded administrator account, rotate or
  remove it. The original user login is retained for compatibility, so existing
  admin accounts remain usable through `/login` until removed.
- Rotate database credentials if they have ever been stored in documentation
  or committed to source control.

### Database Changes

No manual migration is required. Mongoose creates a `trackingevents`
collection on first event and ensures indexes for unique event IDs, event
timestamps, and provider/action reporting. Events use a server-generated UTC
timestamp and contain no customer identity, phone number, or message body.
The first admin login attempt or matching password-reset request creates the `admincredentials`
record from `ADMIN_PASSWORD_HASH`; reset flows update this MongoDB record
without modifying Render environment variables. Restrict database access to
the backend service and include this collection in secure backups.

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
