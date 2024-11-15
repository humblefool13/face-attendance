import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/home";
import Register from "./components/register";
import Attendance from "./components/attendance";
import View from "./components/view";

export default function App() {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="w-[360px] min-h-[800px] bg-gray-100 rounded-md">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/view" element={<View />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}
