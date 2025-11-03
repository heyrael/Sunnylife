# Sunnylife JSON Table Viewer

A single-page web application for transforming JSON snippets into an interactive table. Paste your data, press **Render table**, and explore the rows without leaving the browser.

## Getting started

1. Start a simple HTTP server from the project root. Any static server works – here are two options:
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js (if installed)
   npx serve .
   ```
2. Open `http://localhost:8000` in your browser.
3. Paste JSON into the editor and click **Render table** (or press `Ctrl/Cmd + Enter`).

## Features

- Accepts arrays of objects, primitives, or single JSON objects.
- Automatically derives table headers from the combined keys of your data.
- Gracefully handles nested structures by showing inline JSON strings.
- Includes a sample dataset for quick demos.
- Accessible focus states and responsive layout for comfortable browsing on any device.

## Project structure

```
├── app.js        # Rendering logic and event handlers
├── index.html    # Main HTML document
├── styles.css    # Layout and styling
└── README.md     # Project overview and usage guide
```
