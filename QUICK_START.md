# Quick Start Guide - One Call Service

## 🎉 Application is Ready!

Both servers are now running and the database is seeded with sample data.

### 🌐 Access Points

- **Frontend (User Interface)**: http://localhost:5173
- **Backend (API)**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

---

## 📱 Testing the Application

### 1️⃣ Test Customer Flow

#### Login as Admin First (to verify setup)
```
Email: admin@onecallservice.com
Password: Admin123
Role: Admin
```

#### Create a Test Customer Account
1. Go to http://localhost:5173/register
2. Fill in the form:
   - Name: Test Customer
   - Email: customer@test.com
   - Phone: 9876543210
   - Role: **Customer**
3. Click Register
4. You'll be logged in automatically

#### Browse Services
1. Click "Explore Services" or navigate to `/services`
2. View the list of 15+ services across 7 categories
3. Use the search bar to find services
4. Filter by category (Plumber, House Cleaning, etc.)

#### View Service Details
1. Click "View Details" on any service
2. See:
   - Service description
   - Base price
   - Estimated time
   - Rating and reviews
   - "Book Now" button

#### Book a Service (3-Step Wizard)
1. Click "Book Now" on any service
2. **Step 1 - Select Service**: Service ID is auto-filled
3. **Step 2 - Choose Date & Time**:
   - Select any future date
   - Pick a time slot (08:00 AM to 05:00 PM)
4. **Step 3 - Enter Details**:
   - Name, phone, email auto-filled from profile
   - Enter service address (street, area, city, pincode)
   - Add special instructions (optional)
   - Choose payment method (Cash or Online)
5. Click "Confirm Booking"
6. See booking confirmation with Booking ID

#### View My Bookings
1. Click "Dashboard" or navigate to `/dashboard`
2. See:
   - Welcome message
   - Quick action buttons
   - Your recent bookings (max 3)
3. Click "View All" to see `/my-bookings` page with:
   - All bookings with status filter
   - Booking history
   - Status tracking

#### View Offers
1. Navigate to `/offers`
2. See active promotional offers:
   - 20% OFF on All Services
   - Premium subscription ₹549/month
   - ₹100 OFF on First Booking

---

### 2️⃣ Test Provider Flow

#### Create a Test Provider Account
1. Go to http://localhost:5173/register
2. Fill in the form:
   - Name: Test Provider
   - Email: provider@test.com
   - Phone: 9876543211
   - Role: **Provider**
3. Click Register

#### Access Provider Dashboard
1. Navigate to http://localhost:5173/provider/dashboard
2. See dashboard with:
   - 5 Pending bookings
   - 2 Active jobs
   - 48 Completed services
   - Total earnings: ₹15,000
   - Recent reviews with 4.8 rating
3. See buttons to accept/reject new bookings

---

### 3️⃣ Test Admin Flow

#### Login as Admin
1. Go to http://localhost:5173/login
2. Use credentials:
   ```
   Email: admin@onecallservice.com
   Password: Admin123
   ```

#### Access Admin Dashboard
1. Navigate to http://localhost:5173/admin/dashboard
2. View dashboard stats:
   - Total Customers
   - Total Providers
   - Total Bookings
   - Total Revenue
   - Bookings by Status
3. See management buttons:
   - View All Users
   - Verify Providers
   - Manage Services
   - View Payments

---

### 4️⃣ Test Public Pages

#### Homepage
- Click logo or navigate to `/`
- See hero section with "One Call. Every Service."
- Browse service preview (6 services)
- View "How It Works" section
- See featured services
- View special offers
- About section with benefits

#### Services Page
- Navigate to `/services`
- Search for services by keyword
- Filter by category
- View service cards with:
  - Category emoji icon
  - Service name
  - Price
  - Rating
  - "View Details" link

#### Offers Page
- Navigate to `/offers`
- See all active promotional offers
- Each offer shows:
  - Discount type (percentage/fixed)
  - Discount code
  - Valid until date
  - "Apply Offer" button

#### About Page
- Navigate to `/about`
- Company mission and vision
- Core values (Customer First, Quality, Quick & Reliable)
- Team member profiles

#### Contact Page
- Navigate to `/contact`
- See contact information:
  - Email
  - Phone number
  - Office address
- Fill and submit contact form
- FAQ section at bottom

---

## 🧪 API Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "Password123",
    "role": "customer"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@onecallservice.com",
    "password": "Admin123"
  }'
```

### Get All Services
```bash
curl http://localhost:5000/api/services
```

### Get Services by Category
```bash
curl http://localhost:5000/api/services?category=Plumber
```

### Search Services
```bash
curl http://localhost:5000/api/services?search=Cleaning
```

---

## 🛑 Stop the Application

To stop the servers:

1. **Backend**: Press `Ctrl+C` in the backend terminal
2. **Frontend**: Press `Ctrl+C` in the frontend terminal

---

## 🔄 Restart the Application

To restart:

### Terminal 1 - Backend
```bash
cd "c:\Users\golan\OneDrive\Documents\projects\one call service\backend"
npm run dev
```

### Terminal 2 - Frontend
```bash
cd "c:\Users\golan\OneDrive\Documents\projects\one call service\frontend"
npm run dev
```

---

## 📊 Database Access

View and manage MongoDB data:

### Using MongoDB Compass
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Database: `one-call-service`
4. Collections:
   - `users` - Customer, provider, admin accounts
   - `services` - Available services (15+ records)
   - `locations` - Serviceable areas (5 records)
   - `offers` - Promotional offers (3 records)
   - `bookings` - Service bookings
   - `reviews` - Service ratings
   - `payments` - Payment transactions
   - `notifications` - User notifications
   - `complaints` - Support tickets

---

## ✨ Key Features to Explore

✅ **Complete Authentication**
- Register with role selection
- Login with JWT token
- Profile management
- Password change

✅ **Service Browsing**
- 15+ services across 7 categories
- Search and filter functionality
- Service details with reviews
- Rating display

✅ **Booking System**
- 3-step booking wizard
- Automatic booking ID generation
- Date/time selection
- Address entry
- Payment method selection
- Booking confirmation

✅ **Dashboards**
- Customer dashboard with bookings
- Provider dashboard with earnings
- Admin dashboard with statistics

✅ **Offers & Promotions**
- Active promotional offers
- Discount codes
- Premium subscription option

✅ **Responsive Design**
- Mobile-friendly interface
- Tailwind CSS styling
- Lucide React icons
- Smooth animations

---

## 🆘 Troubleshooting

### Issue: Frontend shows "Cannot GET /"
**Solution**: 
- Ensure frontend server is running at http://localhost:5173
- Check browser console for errors
- Restart frontend with `npm run dev`

### Issue: API calls fail with 404
**Solution**:
- Verify backend is running at http://localhost:5000
- Check backend console for errors
- Verify .env file has correct API URL in frontend

### Issue: "Cannot connect to MongoDB"
**Solution**:
- Ensure MongoDB is running: `mongod`
- Check connection string in backend .env
- Default: `mongodb://localhost:27017/one-call-service`

### Issue: "Port 5000/5173 already in use"
**Solution**:
- Kill existing process on that port
- Or change port in .env file
- Restart server

---

## 📝 Sample Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@onecallservice.com | Admin123 |
| Customer | *Register new* | Create your own |
| Provider | *Register new* | Create your own |

---

## 🎯 Next Steps

1. ✅ Explore all pages and features
2. ✅ Test complete booking flow
3. ✅ Create multiple user accounts
4. ✅ Test provider/admin features
5. ✅ Verify API endpoints
6. ✅ Check database in MongoDB Compass
7. 🚀 Deploy to production (Vercel + Render)

---

**Congratulations! 🎉 Your One Call Service application is fully set up and running!**

For detailed documentation, see [README.md](./README.md)
