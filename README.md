English / [简体中文](./README_CN.md) / [日本語](./README_JA.md)

# One-click Tab Group Extension

## Introduction

Create tab groups based on second-level domains with one click, automatically name tab groups, expand or collapse all groups with one click, expand specific groups, or clear all groups.

## Features

- **Group tabs by domain**
- **Expand all groups**
- **Toggle specific group**
- **Clear all groups**

## Usage

1. Click the extension icon in the browser toolbar or use the shortcut **Ctrl+Shift+1** to open the extension popup.
2. Click the following buttons to manage tab groups or use the shortcut **tab** to select buttons:
   - **Group tabs by domain**: Group tabs by domain.
   - **Expand all groups**: Expand all tab groups.
   - **Toggle specific group**: Enter the group name to expand a specific group.
   - **Clear all groups**: Clear all tab groups.

Tip：Manage your browser shortcuts from chrome://extensions/shortcuts

## File Structure

- `_locales`: Localization files.
- `popup.js`: Main logic file of the extension.
- `popup.html`: User interface file of the extension.
- `popup.css`: Style file of the extension.

## Installation

1. Clone or download this repository.
2. Open the browser and go to the extension management page (e.g., in Chrome, visit `chrome://extensions/`).
3. Enable developer mode.
4. Click the "Load unpacked" button and select the downloaded repository folder.

## Localization

The extension supports multiple languages, including Chinese, English, and Japanese. Localization files can be found in the `_locales` folder.

## Contribution

Contributions and issues are welcome. Please submit pull requests or report issues on GitHub.

## License

[MIT](./LICENCE)
