import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import CallView from "./views/CallView";
import HomeView from "./views/HomeView";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/call" element={<CallView />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
