import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import CallView from "./views/CallView";
import HomeView from "./views/HomeView";
import LogInView from "./views/LogInView";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/call" element={<CallView />} />
          <Route path="/login" element={<LogInView />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
