# How to Create Upload Preset in Cloudinary

> **Security warning — read before enabling uploads for real students.**
>
> An unsigned preset means the cloud name and preset are baked into the public
> JavaScript bundle, so anyone can upload arbitrary files into this Cloudinary
> account, and every uploaded file is served from a public CDN URL with no
> access control.
>
> This portal uploads **Aadhaar cards, PAN cards and resumes** through this
> path. Do not point it at a real Cloudinary account holding real students'
> documents while the preset is unsigned. The correct fix is a signed,
> server-side upload (the backend issues a signature, files are stored with
> `access_mode: authenticated`, and admins receive short-lived signed URLs).
>
> Uploads currently fail closed: `env-config.js` has no fallback cloud name, so
> nothing is uploaded until these variables are set deliberately.



The "Upload preset not found" error occurs because the upload preset doesn't exist yet. Follow these steps to create it:

## Step-by-Step Instructions

### 1. Go to Cloudinary Dashboard
- Visit: https://cloudinary.com/console
- Sign in with your account (cloud name: `your-cloud-name`)

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
- Verify your cloud name is correct: `your-cloud-name`
- Check that the upload preset name matches exactly: `ml_default`

