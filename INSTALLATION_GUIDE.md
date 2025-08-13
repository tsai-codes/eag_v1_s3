# YouTube Clean Extension - Installation Guide

## Quick Installation Steps

### Step 1: Prepare Icons
1. Create icon files as described in `icons/ICON_INSTRUCTIONS.md`
2. Or download icons from the internet and rename them appropriately
3. Place them in the `icons/` folder

### Step 2: Load Extension in Chrome

1. **Open Chrome Extensions Page**:
   - Type `chrome://extensions/` in your address bar
   - Or go to Menu → More Tools → Extensions

2. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top right corner

3. **Load the Extension**:
   - Click "Load unpacked" button
   - Navigate to your project folder: `d:\Learning\TSAI\EAG\eag_v1_s3`
   - Select the folder and click "Select Folder"

4. **Verify Installation**:
   - The extension should appear in your extensions list
   - You should see "YouTube Clean" with a toggle switch

### Step 3: Test the Extension

1. **Visit YouTube**:
   - Go to https://www.youtube.com
   - You should see fewer ads and suggestions automatically

2. **Use the Popup**:
   - Click the extension icon in your browser toolbar
   - Use the toggle button to enable/disable the extension
   - The page will reload automatically when toggled

## Troubleshooting

### Extension Not Loading
- Make sure all files are in the correct location
- Check that `manifest.json` is valid
- Look for any error messages in the Extensions page

### Extension Not Working on YouTube
- Refresh the YouTube page
- Check if the extension is enabled
- Open browser console (F12) and look for "YouTube Clean" messages

### Missing Icons Error
- Create placeholder icons or use any small PNG files
- Rename them to match the required names (icon16.png, etc.)

## File Structure Verification

Make sure your folder structure looks like this:
```
eag_v1_s3/
├── manifest.json
├── content.js
├── styles.css
├── popup.html
├── popup.js
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
│   └── ICON_INSTRUCTIONS.md
├── README.md
└── INSTALLATION_GUIDE.md
```

## Success Indicators

When the extension is working correctly, you should notice:
- Fewer or no ads on YouTube videos
- Missing sidebar suggestions
- Cleaner homepage (fewer recommendations)
- No end-screen video suggestions
- Console messages saying "YouTube Clean: ..." in browser dev tools

That's it! Your YouTube Clean extension should now be working.
