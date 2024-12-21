import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./login";
// import dashboard from "./dashboard";
function App() {
  return (
    <Router>
      <>
        <Routes>
            <Route path="/" element={<Login />} />
            {/* <Route path="/dashboard" element={<dashboard />} /> */}
        </Routes>
      </>
    </Router>
  );
}

export default App;
