import Topbar from "../Topbar";

const Layout: React.FC<{ children: any }> = ({ children }) => {
  return (
    <div>
      <Topbar />
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
};

export default Layout;
