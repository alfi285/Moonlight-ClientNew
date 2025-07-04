// 📁 src/pages/Register.jsx
import "./Register.css";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // ✅ useNavigate

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // ✅ Correct hook usage

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    if (password !== passwordAgain) {
      setError("❌ Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", {
        username,
        email,
        password,
      });

      console.log("✅ User registered:", res.data);
      setError("✅ Registration Successful! Redirecting...");
      
      // Wait for 1s before redirecting to login
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("❌ Registration failed:", err);
      setError("❌ Error registering user. Please try again.");
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Moon Light</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on{" "}
            <span className="moonlight">Moon Light</span>
          </span>
        </div>

        <div className="loginRight">
          <form className="loginBox" onSubmit={handleSubmit}>
            <input
              placeholder="Username"
              className="loginInput"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              placeholder="E-mail"
              className="loginInput"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              placeholder="Password"
              className="loginInput"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              placeholder="Password again"
              className="loginInput"
              type="password"
              onChange={(e) => setPasswordAgain(e.target.value)}
              required
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <Link to="/login">
              <button className="loginRegisterButton" type="button">
                Log into Account
              </button>
            </Link>
            {error && <p id="error" style={{ color: error.includes("Success") ? "green" : "red" }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
