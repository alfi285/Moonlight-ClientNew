import "./Sidebar.css";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import ChatIcon from '@mui/icons-material/Chat';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import GroupIcon from '@mui/icons-material/Group';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import CloseFriend from "../../closefriend/CloseFriend";
import { useEffect, useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom"; // Optional for redirect

const Sidebar = () => {
  const [friends, setFriends] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Parse user from localStorage safely
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Optional: Redirect if user not found
  // const navigate = useNavigate();
  // if (!currentUser) {
  //   navigate("/login");
  //   return null;
  // }

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (!currentUser?._id) return;

        const res = await axios.get(`${BASE_URL}/api/users/${currentUser._id}`);
        const followedIds = res.data.followings || [];

        const friendData = await Promise.all(
          followedIds.map(id =>
            axios.get(`${BASE_URL}/api/users/${id}`).then(res => res.data)
          )
        );

        setFriends(friendData);
      } catch (err) {
        console.error("Failed to load friends", err);
      }
    };

    fetchFriends();
  }, [currentUser, BASE_URL]);

  if (!currentUser) return null; // Optional: Hide sidebar if not logged in

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem"><RssFeedIcon className="sidebarIcon" /><span className="sidebarListItemText">Feed</span></li>
          <li className="sidebarListItem"><ChatIcon className="sidebarIcon" /><span className="sidebarListItemText">Chats</span></li>
          <li className="sidebarListItem"><PlayCircleFilledIcon className="sidebarIcon" /><span className="sidebarListItemText">Videos</span></li>
          <li className="sidebarListItem"><GroupIcon className="sidebarIcon" /><span className="sidebarListItemText">Groups</span></li>
          <li className="sidebarListItem"><BookmarkIcon className="sidebarIcon" /><span className="sidebarListItemText">Bookmarks</span></li>
          <li className="sidebarListItem"><HelpOutlineIcon className="sidebarIcon" /><span className="sidebarListItemText">Questions</span></li>
          <li className="sidebarListItem"><WorkOutlineIcon className="sidebarIcon" /><span className="sidebarListItemText">Jobs</span></li>
          <li className="sidebarListItem"><EventIcon className="sidebarIcon" /><span className="sidebarListItemText">Events</span></li>
          <li className="sidebarListItem"><SchoolIcon className="sidebarIcon" /><span className="sidebarListItemText">Courses</span></li>
        </ul>

        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />

        <ul className="sidebarFriendList">
          {friends.map(friend => (
            <CloseFriend key={friend._id} user={friend} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
