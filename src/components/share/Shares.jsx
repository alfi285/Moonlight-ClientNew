import "./Shares.css";
import { PermMedia, Label, Room, EmojiEmotions } from "@mui/icons-material";
import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const Share = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!desc && !file) return;

    const formData = new FormData();
    formData.append("desc", desc);
    if (file) {
      formData.append("img", file);
    }

    try {
      await axios.post(`${API_BASE}/api/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setDesc("");
      setFile(null);
      window.location.reload();
    } catch (err) {
      console.error("Post creation failed:", err);
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              user.profilePicture
                ? `${API_BASE}/uploads/${user.profilePicture}`
                : "/assets/person/noAvatar.png"
            }
            alt="Profile"
          />
          <input
            placeholder={`What's on your mind, ${user.username}?`}
            className="shareInput"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <hr className="shareHr" />

        {file && (
          <div className="shareImgContainer">
            <img
              className="shareImg"
              src={URL.createObjectURL(file)}
              alt="Preview"
            />
            <button
              className="shareCancelImg"
              onClick={() => setFile(null)}
            >
              ✖
            </button>
          </div>
        )}

        <form className="shareBottom" onSubmit={handleSubmit}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo</span>
              <input
                type="file"
                id="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>

            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>

            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>

            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feeling</span>
            </div>
          </div>

          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
};

export default Share;
