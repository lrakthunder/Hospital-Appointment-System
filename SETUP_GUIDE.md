# Quick Start Guide

## Hospital Appointment Booking System Setup

### Step 1: Database Setup
1. Open MySQL (via command line, MySQL Workbench, or phpMyAdmin)
2. Create the database:
```sql
CREATE DATABASE pascual_hospital CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2: Backend Setup (Laravel)

Open PowerShell and navigate to the backend directory:

```powershell
cd "d:\Projects\Hospital Appointment Booking System\backend"
```

Install Composer dependencies:
```powershell
composer install
```

Generate application key:
```powershell
php artisan key:generate
```

Run database migrations:
```powershell
php artisan migrate
```

Seed database with demo accounts:
```powershell
php artisan db:seed
```

Start Laravel server:
```powershell
php artisan serve
```

✅ Backend should now be running at: http://localhost:8000

### Step 3: Frontend Setup (Angular)

Open a NEW PowerShell window and navigate to the frontend directory:

```powershell
cd "d:\Projects\Hospital Appointment Booking System\frontend"
```

Install npm dependencies:
```powershell
npm install
```

Start Angular development server:
```powershell
npm start
```

Or alternatively:
```powershell
ng serve
```

✅ Frontend should now be running at: http://localhost:4200

### Step 4: Access the Application

Open your browser and go to: **http://localhost:4200**

#### Login Credentials:

**Admin Access:**
- Email: `admin@hospital.com`
- Password: `Zbsi@1234`

**Regular User Access:**
- Email: `user@test.com`
- Password: `password`

## What You Can Do

### As a User:
1. **Login** with user credentials
2. **Book Appointments** - Choose department, doctor, date, and time
3. **View Appointments** - See all your upcoming appointments
4. **Appointment History** - Review past appointments
5. **Submit Feedback** - Rate your experience and leave comments

### As an Admin:
1. **Login** with admin credentials (same login page)
2. **Dashboard** - View overall statistics
3. **Manage Appointments** - View all appointments, update status, add notes
4. **Calendar View** - See all appointments in a monthly calendar
5. **View Feedback** - Read all user feedback and reviews
6. **Charts & Analytics** - Visual analytics of appointments and feedback

## Common Issues & Solutions

### Issue: "Connection Refused" on Backend
**Solution:** Make sure Laravel server is running on port 8000
```powershell
php artisan serve
```

### Issue: "Connection Refused" on Frontend
**Solution:** Make sure Angular dev server is running on port 4200
```powershell
npm start
```

### Issue: Database Connection Error
**Solution:** 
1. Check MySQL is running
2. Verify database name is `pascual_hospital`
3. Check credentials in `backend/.env` file
4. Default: username=`root`, password=`` (empty)

### Issue: CORS Error
**Solution:** 
1. Ensure both servers are running
2. Backend should be on port 8000
3. Frontend should be on port 4200
4. Check `backend/config/cors.php` includes `http://localhost:4200`

### Issue: Composer Not Found
**Solution:** Install Composer from https://getcomposer.org/

### Issue: Node/NPM Not Found
**Solution:** Install Node.js from https://nodejs.org/

### Issue: Angular CLI Not Found
**Solution:** Install Angular CLI globally
```powershell
npm install -g @angular/cli
```

## Departments Available
- General Medicine
- Cardiology
- Orthopedics
- Pediatrics
- Dermatology
- ENT
- Ophthalmology
- Gynecology
- Neurology
- Psychiatry

## Appointment Statuses
- **Pending** - Newly created, awaiting confirmation
- **Confirmed** - Approved by admin
- **Completed** - Appointment finished
- **Cancelled** - Cancelled by user or admin

## Development Ports
- Backend (Laravel): http://localhost:8000
- Frontend (Angular): http://localhost:4200
- Database (MySQL): localhost:3306

## Next Steps

### To Add More Features:
1. Add email notifications for appointments
2. Implement payment integration
3. Add prescription management
4. Create mobile app version
5. Add video consultation feature

### To Deploy to Production:
1. Build Angular app: `ng build --configuration production`
2. Configure Laravel for production environment
3. Set up proper web server (Apache/Nginx)
4. Use production database
5. Enable SSL/HTTPS
6. Set secure environment variables

## File Structure

```
Hospital Appointment Booking System/
│
├── backend/                 # Laravel 11 Backend
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   └── .env               # Backend configuration
│
├── frontend/               # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   └── environments/
│   ├── angular.json
│   └── package.json
│
└── README.md              # Main documentation
```

## Support

For any issues or questions:
1. Check the main README.md for detailed documentation
2. Review error messages in browser console (F12)
3. Check Laravel logs: `backend/storage/logs/laravel.log`
4. Verify both servers are running

## Testing the System

1. **Register a new user** from the registration page
2. **Login as the new user** and book an appointment
3. **Logout** and login as admin
4. **View the appointment** in admin dashboard
5. **Update the appointment status** to "Confirmed"
6. **Check the calendar** to see the appointment
7. **View the charts** for analytics

Happy coding! 🏥✨
