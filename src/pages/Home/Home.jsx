import './Home.css';
import Sidebar from "../../components/topbar/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import Rightbar from "../../components/topbar/rightbar/Rightbar";
import Feed from "../../components/topbar/feed/Feed";

const Home = () => {
  return (
    <div>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Feed/>
        <Rightbar/>
      </div>
    </div>
  );
};

export default Home;
