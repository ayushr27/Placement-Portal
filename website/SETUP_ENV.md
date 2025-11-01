# Environment Setup Instructions

## Quick Setup

1. In the `website` directory, create a file named `.env` with the following content:

```env
VITE_SERVER=http://localhost:8000
VITE_CLOUDINARY_CLOUD_NAME=dgsbvayag
VITE_CLOUDINARY_UPLOAD_PRESET=student-profiles
```

2. Restart your development server:

```bash
npm run dev
```

## Alternative: Manual Creation

### Windows (PowerShell)
```powershell
cd website
@"
VITE_SERVER=http://localhost:8000
VITE_CLOUDINARY_CLOUD_NAME=dgsbvayag
VITE_CLOUDINARY_UPLOAD_PRESET=student-profiles
"@ | Out-File -FilePath .env -Encoding utf8
```

### Windows (Command Prompt)
```cmd
cd website
echo VITE_SERVER=http://localhost:8000 > .env
echo VITE_CLOUDINARY_CLOUD_NAME=dgsbvayag >> .env
echo VITE_CLOUDINARY_UPLOAD_PRESET=student-profiles >> .env
```

### Linux/Mac
```bash
cd website
cat > .env << EOF
VITE_SERVER=http://localhost:8000
VITE_CLOUDINARY_CLOUD_NAME=dgsbvayag
VITE_CLOUDINARY_UPLOAD_PRESET=student-profiles
EOF
```

## Or Copy from Example

```bash
cd website
cp env.example.txt .env
```

Then edit `.env` if needed.

## Important Notes

- The `.env` file is gitignored and won't be committed to version control
- The cloud name `dgsbvayag` is configured by default in `env-config.js` as a fallback
- You need to create the upload preset `student-profiles` in your Cloudinary dashboard
- Make sure the upload preset is set to "Unsigned" mode for client-side uploads

