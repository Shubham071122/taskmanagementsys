# Task Management System - Frontend

A React-based task management system that allows users to create, read, update, and delete tasks. Built with TypeScript and uses Context API for state management.

## Features

- Create new tasks with title, description, status, and due date
- View all tasks
- Update existing tasks
- Delete tasks
- Responsive design

## Prerequisites

Before running this application, make sure you have:

- Node.js (v20 or higher)
- npm package manager
- Git (for cloning the repository)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Shubham071122/taskmanagementsys
```

2. Navigate to the project directory:
```bash
cd taskmanagementsys
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the root directory and add the following environment variable:
```env
REACT_APP_SERVER_URL=https://taskmanagementsys-backend.vercel.app/api
# If running backend locally, use:
# REACT_APP_SERVER_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The application will open in your default browser at `http://localhost:3000`

## Dependencies

- React
- TypeScript
- axios - For API requests
- react-hot-toast - For notifications
- Other dependencies can be found in package.json

## Project Structure

- `src/context/TaskContext.tsx` - Contains the Task context and provider for state management
- `src/components/` - Contains React components
- `src/interfaces/` - Contains TypeScript interfaces

## API Integration

The frontend communicates with a REST API backend. Make sure the backend server is running and the `REACT_APP_SERVER_URL` environment variable is set correctly.


## License

This project is licensed under the MIT License - see the LICENSE file for details 