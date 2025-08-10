# How to Install VietQR Tax ID Lookup Chrome Extension

## Step 1: Download the Extension Files
1. Download all the files from this project to a folder on your computer
2. Make sure you have these files:
   - `manifest.json`
   - `popup.html`
   - `popup.css`
   - `popup.js`
   - `icons/` folder with all SVG icons

## Step 2: Open Chrome Extensions Page
1. Open Google Chrome browser
2. Type `chrome://extensions/` in the address bar and press Enter
3. OR click the three dots menu (⋮) → More tools → Extensions

## Step 3: Enable Developer Mode
1. In the top right corner of the Extensions page, turn ON "Developer mode"
2. You'll see new buttons appear: "Load unpacked", "Pack extension", "Update"

## Step 4: Load the Extension
1. Click the "Load unpacked" button
2. Browse to the folder where you saved the extension files
3. Select the folder and click "Select Folder" (or "Open")

## Step 5: Pin the Extension (Optional)
1. After loading, you'll see the extension in your extensions list
2. Click the puzzle piece icon (🧩) in Chrome's toolbar
3. Find "VietQR Tax ID Lookup" and click the pin icon to keep it visible

## Step 6: Test the Extension
1. Click on the VietQR extension icon in your toolbar
2. Enter a Vietnamese tax ID (try: `0316794479`)
3. Click Submit to test the lookup

## Troubleshooting

**If the extension doesn't load:**
- Make sure all files are in the same folder
- Check that `manifest.json` is in the root folder
- Ensure Developer mode is turned on

**If API calls don't work:**
- The extension needs internet connection
- VietQR API might have rate limits
- Try different tax IDs if one doesn't work

**Common Tax IDs for Testing:**
- `0316794479` (CASSO Company)
- `0100100101`
- `0200200202`

## Features
- Look up multiple tax IDs at once (separate with semicolons)
- **Copy to Excel** - Export results as tab-separated values for easy pasting into Excel or Google Sheets
- Saves your last search for convenience
- Shows company name, international name, address, and other details
- Handles errors gracefully
- Clean, professional interface with responsive design

## Need Help?
If you have issues installing or using the extension, check that:
1. You're using Google Chrome (not Edge, Firefox, etc.)
2. All extension files are in the same folder
3. Developer mode is enabled
4. Your internet connection is working