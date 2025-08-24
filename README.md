# Hostel Management System

A comprehensive hostel management application built with React, TypeScript, and Capacitor for cross-platform deployment. The system provides separate interfaces for students and administrators to manage hostel operations efficiently.

## Features

### Student Features
- **Dashboard** - Overview of personal information and quick actions
- **Profile Management** - View and update personal details
- **Outpass Application** - Apply for outpass requests
- **Leave Forms** - Submit leave applications
- **Complaints** - File and track complaints
- **Attendance** - View attendance records

### Admin Features
- **Admin Dashboard** - Comprehensive overview of hostel operations
- **Outpass Management** - Review and approve/reject outpass requests
- **Leave Management** - Handle leave form applications
- **Complaints Management** - Monitor and resolve student complaints
- **Attendance Management** - Track and manage student attendance
- **Hostel Settings** - Configure hostel parameters and settings

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **State Management**: Zustand
- **Backend**: Supabase
- **Mobile**: Capacitor for Android deployment
- **Build Tool**: Vite
- **Icons**: Lucide React

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Android Studio (for mobile development)
- Supabase account

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hostel-management/project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Configure your Supabase credentials in `.env`

4. **Database Setup**
   - Run the SQL migrations in the `supabase/migrations/` directory
   - Execute the RLS policies setup scripts

## Development

### Web Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Mobile Development
```bash
# Build and sync for mobile
npm run build:mobile

# Run on Android device/emulator
npm run android:dev

# Build Android APK
npm run android:build
```

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Header, Navbar)
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries (auth, supabase)
├── pages/
│   ├── admin/          # Admin-specific pages
│   ├── student/        # Student-specific pages
│   └── Login.tsx       # Login page
└── App.tsx             # Main application component
```

## Authentication

The system uses a custom authentication system with predefined users:
- **Admin users**: Full access to administrative features
- **Student users**: Access to student-specific features

Default credentials are configured in `src/lib/auth.ts`.

## Database

The application uses Supabase as the backend with the following key features:
- Row Level Security (RLS) policies
- Real-time subscriptions
- User authentication and authorization

## Mobile Deployment

### Android APK Build

1. **Prerequisites**
   - Android Studio installed
   - Android SDK configured
   - Java Development Kit (JDK)

2. **Build Process**
   ```bash
   # Use the provided batch script
   ./build-apk.bat
   
   # Or manually
   npm run build:mobile
   npx cap build android
   ```

3. **APK Location**
   The generated APK will be available in:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

## Configuration Files

- **capacitor.config.ts** - Capacitor configuration
- **tailwind.config.js** - Tailwind CSS configuration
- **vite.config.ts** - Vite build configuration
- **tsconfig.json** - TypeScript configuration

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:mobile` - Build and sync for mobile
- `npm run android:dev` - Run on Android
- `npm run android:build` - Build Android APK
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
