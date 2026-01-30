# Hospital Appointment Booking System - Deployment Instructions

## What's in this package:

1. **Laravel Backend** - All PHP files, vendor dependencies
2. **Angular Frontend** - Pre-built in `public_html/app/`
3. **Database** - SQL file included separately

## Deployment Steps for Hostinger:

### 1. Database Setup
- Import the SQL file through phpMyAdmin
- Note the database name, username, and password

### 2. Update .env file
Edit the `.env` file with your database credentials:
```
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
APP_URL=https://yourdomain.com
```

### 3. Set Document Root
Point your domain's document root to: `public_html/`

### 4. File Permissions
Set these folder permissions to 775:
- storage/
- storage/logs/
- bootstrap/cache/

### 5. PHP Version
Ensure PHP 8.1 or higher is selected in your hosting panel

### 6. Test
Visit your domain. The Angular app should load at: `https://yourdomain.com/app/`

## Important Notes:

- The APP_KEY is already generated in .env
- Angular frontend is pre-compiled (no npm install needed)
- Composer dependencies are included in vendor/
- Storage folder needs write permissions

## Troubleshooting:

**500 Error:** Check storage folder permissions and .env configuration
**404 Error:** Verify document root points to public_html/
**Blank Page:** Check browser console for API endpoint errors
