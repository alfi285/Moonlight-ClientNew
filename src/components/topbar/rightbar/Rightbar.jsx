import "./Rightbar.css";
import Online from "../../online/Online";
import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

const Rightbar = ({ profile, user, showSuggestions }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!currentUser?._id) return; // ✅ prevent crashes

    const fetchOnlineFriends = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/users/${currentUser._id}`);
        const followings = res.data.followings || [];

        const friends = await Promise.all(
          followings.map((id) =>
            axios.get(`${API_BASE}/api/users/${id}`).then((r) => r.data)
          )
        );

        const online = friends.filter((_, idx) => idx % 2 === 0); // simulate online
        setOnlineUsers(online);
      } catch (err) {
        console.error("Failed to fetch online users", err);
      }
    };

    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/suggestions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuggestedUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
      }
    };

    fetchOnlineFriends();
    if (showSuggestions) fetchSuggestions();
  }, [currentUser, showSuggestions, token, API_BASE]);

  const handleFollow = async (targetUserId, isCurrentlyFollowing) => {
    try {
      await axios.put(
        `${API_BASE}/api/users/${targetUserId}/${isCurrentlyFollowing ? "unfollow" : "follow"}`,
        { userId: currentUser._id }
      );

      setSuggestedUsers((prev) =>
        prev.map((u) =>
          u._id === targetUserId
            ? {
                ...u,
                followers: isCurrentlyFollowing
                  ? u.followers.filter((id) => id !== currentUser._id)
                  : [...u.followers, currentUser._id],
              }
            : u
        )
      );
    } catch (err) {
      console.error("Follow/unfollow error", err);
    }
  };

  // 🔐 If not logged in, return null
  if (!currentUser) return null;

  const HomeRightbar = () => (
    <>
      <div className="birthdayContainer">
        <img src="assets/gift.png" alt="" className="birthdayImg" />
        <span className="birthdayText">
          <b>{currentUser.username}</b>, don't forget to check your friends' birthdays!
        </span>
      </div>
      <img src="assets/ad1.jpg" alt="" className="rightbarAd" />
      <h4 className="rightbarTitle">Online Friends</h4>
      <ul className="rightbarFriendList">
        {onlineUsers.map((u) => (
          <Online key={u._id} user={u} />
        ))}
      </ul>
    </>
  );

  const ProfileRightbar = () => (
    <>
      {showSuggestions && (
        <div className="suggestions">
          <h4 className="rightbarTitle">Suggested Users</h4>
          <ul className="suggestedUserList">
            {suggestedUsers
              .filter((u) => u._id !== currentUser._id)
              .map((u) => (
                <li key={u._id} className="suggestedUser">
                  <img
                    src={u.profilePicture || "/assets/person/noAvatar.png"}
                    alt=""
                    className="suggestedUserImg"
                  />
                  <span className="suggestedUsername">{u.username}</span>
                  <button
                    className="followButton"
                    onClick={() =>
                      handleFollow(u._id, u.followers.includes(currentUser._id))
                    }
                  >
                    {u.followers.includes(currentUser._id) ? "Unfollow" : "Follow"}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </>
  );

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {profile ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
};

export default Rightbar;
