import { Route, Routes } from "react-router-dom";
import CallView from "./views/CallView";
import HomeView from "./views/HomeView";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/call" element={<CallView />} />
      </Routes>
    </>
  );
}

export default App;
