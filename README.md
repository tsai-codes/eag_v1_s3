# YouTube Clean Chrome Extension

A Chrome extension that removes advertisements and suggestions from YouTube for a cleaner, distraction-free viewing experience.

## Features

- **Ad Removal**: Removes all types of YouTube advertisements including:
  - Video ads (pre-roll, mid-roll, post-roll)
  - Banner ads
  - Sponsored content
  - YouTube Premium promotions

- **Suggestion Removal**: Hides distracting elements such as:
  - Homepage recommendations
  - Sidebar suggested videos
  - End-screen suggestions
  - Autoplay recommendations
  - Trending content
  - YouTube Shorts

- **Clean Interface**: Provides a focused viewing experience by removing clutter

## Installation

### Manual Installation (Developer Mode)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" by toggling the switch in the top right
3. Click "Load unpacked"
4. Select the folder containing the extension files
5. The extension should now appear in your extensions list

### Using the Extension

1. Navigate to YouTube.com
2. Click the YouTube Clean extension icon in your browser toolbar
3. Toggle the extension on/off using the popup interface
4. The page will automatically reload to apply changes

## Files Structure

```
youtube-clean/
├── manifest.json          # Extension configuration
├── content.js             # Main functionality script
├── styles.css             # Additional CSS for hiding elements
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── icons/                 # Extension icons (16x16, 32x32, 48x48, 128x128)
└── README.md              # This file
```

## How It Works

The extension uses:
- **Content Scripts**: Injected into YouTube pages to remove unwanted elements
- **CSS Injection**: Additional styling to hide advertisement containers
- **DOM Mutation Observer**: Continuously monitors for new ads and suggestions
- **Popup Interface**: Allows users to toggle the extension on/off

## Permissions

- `activeTab`: Access to the currently active tab to inject scripts on YouTube

## Browser Compatibility

- Chrome (Manifest V3)
- Microsoft Edge (Chromium-based)
- Other Chromium-based browsers

## Customization

You can modify the `content.js` file to add or remove specific selectors for elements you want to hide. The extension is designed to be easily customizable.

## Troubleshooting

- **Extension not working**: Try reloading the YouTube page
- **Elements still showing**: Some new ad formats may need additional selectors
- **Page looks broken**: Disable the extension temporarily

## Notes

- This extension is for educational purposes
- YouTube's structure changes frequently, so the extension may need updates
- Some functionality may break with YouTube updates

## Contributing

Feel free to contribute by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Adding new selectors for ads/suggestions

## License

This project is open source and available under the MIT License.