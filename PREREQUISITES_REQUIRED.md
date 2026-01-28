# ⚠️ IMPORTANT: System Requirements Not Met

## Current Issues Detected

Your system is missing some required components to run the Hospital Appointment Booking System:

### 🔴 Missing Components:

1. **Git** - Not installed or not in PATH
2. **PHP Extensions** - The following need to be enabled:
   - `fileinfo` extension
   - `zip` extension

### ✅ How to Fix

#### Option 1: Install Git (Recommended)
1. Download Git from: https://git-scm.com/download/win
2. Install with default options
3. Restart PowerShell
4. Verify: `git --version`

#### Option 2: Enable PHP Extensions
Edit `C:\php\php.ini` and uncomment these lines (remove the `;`):
```ini
extension=fileinfo
extension=zip
```

Then restart PowerShell.

### 📋 Complete Setup Checklist

Before running the application, ensure you have:

- [ ] **PHP 8.2+** installed
  - Test: `php --version`
  - Download: https://windows.php.net/download/

- [ ] **Composer** installed
  - Test: `composer --version`
  - Download: https://getcomposer.org/download/

- [ ] **Git** installed
  - Test: `git --version`
  - Download: https://git-scm.com/download/win

- [ ] **Node.js & npm** installed
  - Test: `node --version` and `npm --version`
  - Download: https://nodejs.org/ (LTS version)

- [ ] **MySQL** installed and running
  - Download XAMPP: https://www.apachefriends.org/
  - Or MySQL: https://dev.mysql.com/downloads/installer/

- [ ] **PHP Extensions enabled** in php.ini:
  ```ini
  extension=fileinfo
  extension=zip
  extension=pdo_mysql
  extension=mbstring
  extension=openssl
  ```

### 🚀 After Installing Prerequisites

Once all components are installed, run these commands:

```powershell
# 1. Create database
mysql -u root -p
CREATE DATABASE pascual_hospital;
exit;

# 2. Setup backend
cd "d:\Projects\Hospital Appointment Booking System\backend"
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve

# 3. In a NEW terminal, setup frontend
cd "d:\Projects\Hospital Appointment Booking System\frontend"
npm install
npm start
```

### 📞 Need Help?

If you're using **XAMPP**:
1. Install XAMPP from https://www.apachefriends.org/
2. Start Apache and MySQL from XAMPP Control Panel
3. PHP and MySQL will be available automatically

Then proceed with Git and Node.js installation.

### ⚡ Quick Start with XAMPP

1. **Install XAMPP** - Includes PHP, MySQL, and phpMyAdmin
2. **Install Git** - For Composer to download packages
3. **Install Node.js** - For the Angular frontend
4. **Install Composer** - For PHP package management

After installing these 4 tools, you'll be ready to run the application!

---

**Current Status**: System prerequisites need to be installed before the application can run.
