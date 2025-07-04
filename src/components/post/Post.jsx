import './Post.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Comment from '../comments/Comment';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL;

const Post = ({ post }) => {
  const [like, setLike] = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [post.likes, currentUser._id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/users/${post.userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("User fetch failed:", err);
      }
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = async () => {
    try {
      await axios.put(`${API_BASE}/api/posts/${post._id}/like`, {
        userId: currentUser._id,
      });
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) return;
    try {
      await axios.post(`${API_BASE}/api/posts/${post._id}/comment`, {
        userId: currentUser._id,
        username: currentUser.username,
        text: newComment,
      });
      setComments([
        ...comments,
        {
          userId: currentUser._id,
          username: currentUser.username,
          text: newComment,
        },
      ]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <div className='post'>
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`} style={{ textDecoration: "none", color: "inherit" }}>
              <img
                src={user.profilePicture || "/assets/person/noAvatar.png"}
                alt=""
                className="postProfileImg"
              />
            </Link>
            <Link to={`/profile/${user.username}`} style={{ textDecoration: "none", color: "inherit" }}>
              <span className="postUsername">{user.username}</span>
            </Link>
            <span className="postDate">{new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <div className="postTopRight">
            <MoreVertIcon />
          </div>
        </div>

        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          {post.img && (
            <img
              className='postImg'
              src={`${API_BASE}/uploads/${post.img}`}
              alt="post"
            />
          )}
        </div>

        <div className="postBottom">
          <div className="postBottomLeft">
            <img className='likeIcon' src="/assets/like.png" onClick={likeHandler} alt="Like" />
            <img className='likeIcon' src="/assets/heart.png" onClick={likeHandler} alt="Heart" />
            <span className="postLikeCounter">{like} people like this</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{comments.length} comments</span>
          </div>
        </div>

        <form className="commentBox" onSubmit={handleCommentSubmit}>
          <input
            type="text"
            placeholder="Write a comment..."
            className="commentInput"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className="commentButton">Post</button>
        </form>

        <div className="commentsContainer">
          {comments.map((c, index) => (
            <Comment key={index} comment={c} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
