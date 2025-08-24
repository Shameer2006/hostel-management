# Supabase Setup Instructions for Hostel Management System

## 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - Name: `hostel-management`
   - Database Password: (create a secure password)
   - Region: (choose closest to your users)

## 2. Database Setup

### Run Migration
1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the content from `supabase/migrations/create_database_schema.sql`
3. Click "Run" to execute the migration
4. Verify tables are created in the Table Editor

### Enable Row Level Security
The migration automatically enables RLS on all tables and creates appropriate policies.

## 3. Storage Setup

### Create Storage Buckets
1. Go to Storage in your Supabase dashboard
2. Create two buckets:

**Bucket 1: leave-templates**
- Name: `leave-templates`
- Public: Yes (for template downloads)
- File size limit: 10MB
- Allowed MIME types: `application/pdf`

**Bucket 2: leave-submissions**
- Name: `leave-submissions`
- Public: No (private, access via signed URLs)
- File size limit: 5MB
- Allowed MIME types: `application/pdf`

### Upload Sample Template
1. Create a sample leave application template (PDF)
2. Upload it to the `leave-templates` bucket
3. Name it `leave_application_template.pdf`

## 4. Environment Variables

Update your `.env` file with your project details:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Find these values in:
- Project URL: Settings → API → Project URL
- Anon Key: Settings → API → Project API Keys → anon/public

## 5. Authentication Setup

This system uses local authentication, NOT Supabase Auth. The credentials are defined in `src/lib/auth.ts`:

**Default Users:**
- Student: `student1` / `password123`
- Student: `student2` / `password123`  
- Admin: `admin1` / `admin123`

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Try logging in with the test credentials
4. Verify all features work:
   - Dashboard loads hostel info
   - Profile can be updated
   - Outpass requests can be submitted
   - Leave forms can be uploaded
   - Complaints can be submitted
   - Attendance can be marked

## 7. Production Considerations

### Security
- Change default passwords
- Use environment variables for sensitive data
- Enable additional RLS policies as needed
- Set up database backups
- Configure proper CORS settings

### Performance
- Add database indexes for frequently queried columns
- Set up database connection pooling
- Configure CDN for static assets
- Monitor query performance

### Monitoring
- Enable database monitoring
- Set up error tracking
- Configure uptime monitoring
- Set up automated backups

## 8. Optional Features

### Email Notifications
- Set up email templates in Supabase
- Configure SMTP settings
- Add email triggers for important events

### File Management
- Set up automatic file cleanup
- Configure file compression
- Add file versioning

### Analytics
- Add usage tracking
- Set up performance monitoring
- Create admin analytics dashboard