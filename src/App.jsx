import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Profile from './components/profile/Profile';
import Home from './pages/Home/Home';
import Register from './pages/Home/register/Register';
import Login from './pages/login/Login';

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /home */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/home" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/profile/:username" element={token ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
