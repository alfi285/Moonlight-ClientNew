import "./Topbar.css";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const Topbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      try {
        const res = await axios.get(`${API_BASE}/api/users?username=${searchQuery}`);
        if (res.data?._id) {
          setErrorMessage("");
          window.location.href = `/profile/${searchQuery}`;
        }
      } catch (err) {
        console.error("User not found:", err);
        setErrorMessage("⚠️ Enter a registered user or check the username");
      }
    }
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/home" style={{ textDecoration: "none", color: "white" }}>
          <span className="logo">Moon Light</span>
        </Link>
      </div>

      <div className="topbarCenter">
        <div className="searchbar">
          <SearchIcon />
          <input
            placeholder="Search by username"
            className="searchInput"
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        {errorMessage && <p className="searchError">{errorMessage}</p>}
      </div>

      <div className="topbarRight">
        <div className="topbarLinks">
          <Link to="/home" className="topbarLink">
            Homepage
          </Link>
        </div>

        <div className="topbarIcons">
          <div className="topbarIconItem">
            <PersonIcon />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <ChatIcon />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <CircleNotificationsIcon />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>

        <Link to={`/profile/${user?.username}`} className="topbarProfile">
          <img
            src={
              user?.profilePicture
                ? user.profilePicture
                : "/assets/person/noAvatar.png"
            }
            alt="profile"
            className="topbarImg"
          />
          <p className="uname">{user?.username}</p>
        </Link>

        <button className="logoutBtn" onClick={handleLogout}>
          <ExitToAppIcon style={{ marginRight: "5px" }} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
