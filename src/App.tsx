import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import Home from './components/Home.tsx';
import Login from './components/auth/Login.tsx';
import Register from './components/auth/Register.tsx';
import TaskList from './components/tasks/TaskList.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import { Toaster } from 'react-hot-toast';
import { TaskProvider } from './context/TaskContext.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <Toaster position="top-center" />
          <Routes>
            <Route
            path="/"
            element={
              <Home />
            }
          />
          <Route
            path="/login"
            element={
              <Login />
            }
          />
          <Route
            path="/signup"
            element={
              <Register />
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <TaskList />
              </PrivateRoute>
            }
          />
        </Routes>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
};


export default App; 