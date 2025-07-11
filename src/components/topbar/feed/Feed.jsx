import './Feed.css';
import Post from '../../post/Post';
import Shares from '../../share/Shares';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

const Feed = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchPosts = async () => {
    if (!user || !user._id) {
      console.warn("❌ User ID not found. Skipping fetch.");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = username
        ? await axios.get(`${API_BASE}/api/posts/profile/${username}`, config)
        : await axios.get(`${API_BASE}/api/posts/timeline/all?userId=${user._id}`, config);

      setPosts(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [username]);

  return (
    <div className='feed'>
      <div className="feedWrapper">
        {!username && <Shares onPostShared={fetchPosts} />}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
