import "./Profile.css";
import Sidebar from "../../components/topbar/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import Rightbar from "../../components/topbar/rightbar/Rightbar";
import Feed from "../../components/topbar/feed/Feed";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [city, setCity] = useState("");
  const [relationship, setRelationship] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [coverPicFile, setCoverPicFile] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);

  const token = localStorage.getItem("token");
  const localCurrentUser = JSON.parse(localStorage.getItem("user"));

  if (!localStorage.getItem("user")) {
  window.location.href = "/login";
  return null;
}


  useEffect(() => {
    if (!localCurrentUser || !localCurrentUser._id) {
      console.warn("⛔ No current user found. Skipping profile fetch.");
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${API_BASE}/api/users?username=${username}`);
        setUser(userRes.data);
        setCity(userRes.data.from || "");
        setRelationship(userRes.data.relationship || "");
        setBio(userRes.data.bio || "");

        const currentUserRes = await axios.get(
          `${API_BASE}/api/users/${localCurrentUser._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCurrentUserData(currentUserRes.data);

        setIsFollowing(userRes.data.followers?.includes(currentUserRes.data._id));
      } catch (err) {
        console.error("❌ Failed to fetch profile or current user:", err);
      }
    };

    fetchData();
  }, [username]);

  const handleFollow = async () => {
    try {
      await axios.put(
        `${API_BASE}/api/users/${user._id}/${isFollowing ? "unfollow" : "follow"}`,
        { userId: localCurrentUser._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsFollowing(!isFollowing);
      setUser((prevUser) => ({
        ...prevUser,
        followers: isFollowing
          ? prevUser.followers.filter((id) => id !== localCurrentUser._id)
          : [...prevUser.followers, localCurrentUser._id],
      }));
    } catch (err) {
      console.error("❌ Follow/Unfollow failed:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      let profilePicture = user.profilePicture;
      let coverPicture = user.coverPicture;

      if (profilePicFile) {
        const profileData = new FormData();
        profileData.append("file", profilePicFile);
        const uploadRes = await axios.post(`${API_BASE}/api/upload`, profileData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        profilePicture = `${API_BASE}/uploads/${uploadRes.data.filename}`;
      }

      if (coverPicFile) {
        const coverData = new FormData();
        coverData.append("file", coverPicFile);
        const coverRes = await axios.post(`${API_BASE}/api/upload`, coverData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        coverPicture = `${API_BASE}/uploads/${coverRes.data.filename}`;
      }

      const updateRes = await axios.put(
        `${API_BASE}/api/users/${user._id}`,
        {
          userId: localCurrentUser._id,
          from: city,
          relationship,
          bio,
          profilePicture,
          coverPicture,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCity(updateRes.data.from || "");
      setRelationship(updateRes.data.relationship || "");
      setBio(updateRes.data.bio || "");

      if (localCurrentUser._id === user._id) {
        localStorage.setItem("user", JSON.stringify(updateRes.data));
      }

      window.location.reload();
    } catch (err) {
      console.error("❌ Profile update failed:", err);
      alert("Update failed.");
    }
  };

  const relationshipText = (code) => {
    if (code === "1") return "Single";
    if (code === "2") return "Married";
    if (code === "3") return "Complicated";
    return "Not specified";
  };

  return (
    <div>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <label htmlFor="coverUpload">
                <img
                  className="profileCoverImg"
                  src={
                    coverPicFile
                      ? URL.createObjectURL(coverPicFile)
                      : user.coverPicture?.startsWith("https://")
                      ? user.coverPicture
                      : `${API_BASE}/uploads/${user.coverPicture}` || "/assets/post/defaultCover.jpg"
                  }
                  alt="cover"
                />
              </label>
              <input
                type="file"
                id="coverUpload"
                style={{ display: "none" }}
                onChange={(e) => setCoverPicFile(e.target.files[0])}
              />

              <label htmlFor="profileUpload">
                <img
                  className="profileUserImg"
                  src={
                    profilePicFile
                      ? URL.createObjectURL(profilePicFile)
                      : user.profilePicture?.startsWith("https://")
                      ? user.profilePicture
                      : `${API_BASE}/uploads/${user.profilePicture}` || "/assets/person/noAvatar.png"
                  }
                  alt="profile"
                />
              </label>
              <input
                type="file"
                id="profileUpload"
                style={{ display: "none" }}
                onChange={(e) => setProfilePicFile(e.target.files[0])}
              />
            </div>

            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <div className="profileStats">
                <span><strong>{user.followers?.length || 0}</strong> Followers</span>
                <span><strong>{user.followings?.length || 0}</strong> Following</span>
              </div>
              <span className="profileInfoDesc">{bio || user.bio || "No bio available"}</span>
              <span className="profileInfoCity">📍 {user.from || "Unknown City"}</span>
              <span className="profileInfoRel">💍 {relationshipText(user.relationship)}</span>

              {localCurrentUser?.username === username ? (
                <div className="profileEditSection">
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="profileEditInput"
                  />
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="profileEditInput"
                  >
                    <option value="">Relationship</option>
                    <option value="1">Single</option>
                    <option value="2">Married</option>
                    <option value="3">Complicated</option>
                  </select>
                  <textarea
                    placeholder="Bio"
                    className="profileEditInput"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                  <button className="profileUpdateBtn" onClick={handleUpdate}>
                    Update Profile
                  </button>
                </div>
              ) : (
                <button className="followBtn" onClick={handleFollow}>
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          </div>

          <div className="profileRightBottom" style={{ display: "flex" }}>
            <Feed username={username} />
            <Rightbar user={user} profile showSuggestions={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
