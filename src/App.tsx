import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./login";
import Dashboard from "./user/index.tsx";
function App() {
  return (
    <Router>
      <>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/user" element={<Dashboard />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
