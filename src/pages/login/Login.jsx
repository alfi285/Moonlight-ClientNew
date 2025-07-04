import './Login.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/home";
    } catch (err) {
      setError("❌ Invalid credentials or server error");
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Moon Light</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on <span className="moonlight">Moon Light</span>
          </span>
        </div>

        <div className="loginRight">
          <form className="loginbox" onSubmit={handleSubmit}>
            <input
              type="email"
              className="loginInput"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="loginInput"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="loginButton" type="submit">Log In</button>
            <span className="loginforgot">Forgot Password?</span>
            <button
              className="loginRegisterButton"
              type="button"
              onClick={() => navigate("/register")}
            >
              Create a New Account
            </button>
            {error && <p id="error" style={{ color: "red" }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
