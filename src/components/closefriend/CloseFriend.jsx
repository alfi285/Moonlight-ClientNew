import "./CloseFriend.css";

const CloseFriend = ({ user }) => {
  return (
    <li className="sidebarFriend">
      <img
        className="sidebarFriendImg"
        src={user.profilePicture || "/assets/person/noAvatar.png"}
        alt="friend"
      />
      <span className="sidebarFriendName">{user.username}</span>
    </li>
  );
};

export default CloseFriend;
