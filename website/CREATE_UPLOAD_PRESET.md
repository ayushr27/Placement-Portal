# How to Create Upload Preset in Cloudinary

The "Upload preset not found" error occurs because the upload preset doesn't exist yet. Follow these steps to create it:

## Step-by-Step Instructions

### 1. Go to Cloudinary Dashboard
- Visit: https://cloudinary.com/console
- Sign in with your account (cloud name: `dgsbvayag`)

### 2. Navigate to Upload Settings
- Click on **"Settings"** (gear icon) in the top menu
- Select **"Upload"** from the left sidebar

### 3. Create an Unsigned Upload Preset
- Scroll down to **"Upload presets"** section
- Click **"Add upload preset"** button

### 4. Configure the Preset
- **Upload preset name**: `ml_default`
- **Signing mode**: Select **"Unsigned"** (IMPORTANT - this allows client-side uploads)
- **Folder**: `student-profiles`

### 5. Save
- Click the **"Save"** button at the bottom

### Alternative: Use the Default Preset
If you can't create a preset, I've updated the code to use `ml_default` which is typically available by default in most Cloudinary accounts.

## Quick Test
After creating the preset, try uploading an image again. The error should be resolved.

## Troubleshooting

### If you get CORS errors:
1. Go to **Settings** → **Security**
2. Scroll to **"Allowed fetch domains"**
3. Add your localhost domain: `http://localhost:3000` or your production URL
4. OR select "Allow all domains" for development

### If still getting errors:
- Make sure the upload preset is set to "Unsigned"
- Verify your cloud name is correct: `dgsbvayag`
- Check that the upload preset name matches exactly: `ml_default`

