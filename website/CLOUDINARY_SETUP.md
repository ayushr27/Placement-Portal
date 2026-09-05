# Cloudinary Integration Setup

This application uses Cloudinary to upload and manage images from file uploads.

## Setup Instructions

### 1. Create a Cloudinary Account

1. Go to [Cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Access your dashboard

### 2. Get Your Credentials

From your Cloudinary dashboard:
- **Cloud Name**: Found in the "Account Details" section (e.g., `dgsbvayag`)

### 3. Create an Upload Preset

1. In your Cloudinary dashboard, go to **Settings** → **Upload**
2. Click **"Add upload preset"**
3. Configure:
   - **Preset name**: `student-profiles`
   - **Signing Mode**: Choose "Unsigned" for client-side uploads
   - **Folder**: `student-profiles`
   - Click **Save**

### 4. Configure Environment Variables

Create a `.env` file in the `website` directory with the following:

```env
# API Server URL
VITE_SERVER=http://localhost:8000

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=dgsbvayag
VITE_CLOUDINARY_UPLOAD_PRESET=student-profiles
```

### 5. Restart Development Server

After adding the environment variables:

```bash
npm run dev
```

## How It Works

1. Users select image files from their device using the file upload buttons
2. The application uploads these files directly to Cloudinary
3. Images are stored in the `student-profiles` folder on Cloudinary
4. The Cloudinary secure URL is returned and saved to the database
5. This ensures consistent image hosting and better performance

## Supported Fields

The following fields support direct file upload to Cloudinary:
- **Profile Picture**: Upload any image file
- **Aadhar Card**: Upload Aadhar card image
- **PAN Card**: Upload PAN card image
- **Resume**: Upload PDF or image file

### File Type Support
- Images: JPG, PNG, GIF, WebP
- Documents: PDF (for resumes)

### File Size Limit
- Maximum file size: 10MB per file

## Profile Form Navigation

The profile update form now has a multi-step navigation:
- **Section 1**: Personal Info → Click "Next"
- **Section 2**: Academic → Click "Next"
- **Section 3**: Address → Click "Next"
- **Section 4**: Documents → Click "Next"
- **Section 5**: Links & Career → Click "Save Changes"

Only the last section saves the profile. Use "Previous" to go back to earlier sections.

## How to Use

1. Click the "Edit Profile" button
2. Navigate to the relevant section (Personal Info, Documents, or Links & Career)
3. Click the file upload area to select a file
4. Wait for the upload to complete (you'll see a success message)
5. Continue to the next section or save your changes

## Troubleshooting

### Upload fails
- Verify your Cloudinary credentials are correct in `.env`
- Check that your upload preset is set to "Unsigned"
- Ensure files are under 10MB

### Images not loading
- Check that the Cloudinary cloud name is correct
- Verify the upload preset exists in your Cloudinary dashboard
- Check browser console for any errors

### Environment variables not working
- Make sure `.env` file is in the `website` directory
- Restart the development server after adding variables
- Check that variable names start with `VITE_`

### CORS errors
- Go to Cloudinary Settings → Security
- Add your domain to the Allowed domains list
- Or use "Allow all domains" for development

