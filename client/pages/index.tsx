import ProtectedRoute from "../src/components/ProtectedRoute";

import Layout from "../src/components/Layout";
import Vault from "../src/components/Vault";

const Home = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Vault />
      </Layout>
    </ProtectedRoute>
  );
};
export default Home;
