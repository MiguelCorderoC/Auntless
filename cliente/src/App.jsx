import { Route, Routes } from "react-router-dom";
import CallView from "./views/CallView";

function App() {
  return (
    <>
      <Routes>
        <Route path="/call" element={<CallView />} />
      </Routes>
    </>
  );
}

export default App;
