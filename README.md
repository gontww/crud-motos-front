# CRUD Motorcycle Rental Application

This project is a simple CRUD application for motorcycle rentals built with Vue.js and Vite. It includes three main screens: a login screen, a listing screen for available motorcycles, and a reports screen for rental statistics.

## Project Structure

```
frontend
├── src
│   ├── App.vue                # Main application component with router-view
│   ├── main.js                # Entry point of the application
│   ├── assets
│   │   ├── base.css           # Base styles for the application
│   │   └── main.css           # Main styles for the application
│   ├── components
│   │   ├── LoginScreen.vue    # Component for user login
│   │   ├── ListingScreen.vue   # Component for displaying available motorcycles
│   │   └── ReportsScreen.vue   # Component for displaying rental reports
│   └── router
│       └── index.js           # Vue Router setup and route definitions
├── package.json                # npm configuration file
├── vite.config.js              # Vite configuration file
└── README.md                   # Project documentation
```

## Installation

To get started with the project, clone the repository and install the dependencies:

```sh
npm install
```

## Development

To run the application in development mode, use the following command:

```sh
npm run dev
```

This will start the Vite development server and open the application in your default web browser.

## Build

To build the application for production, run:

```sh
npm run build
```

This will create a `dist` directory with the production-ready files.

## Features

- User authentication with a login screen.
- Listing of available motorcycles for rent.
- Reports screen to view rental statistics.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you'd like to add.