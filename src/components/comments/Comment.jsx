import './Comment.css';

const Comment = ({ comment }) => {
  return (
    <div className="comment">
      <strong>{comment.username}</strong>: {comment.text}
    </div>
  );
};

export default Comment;
