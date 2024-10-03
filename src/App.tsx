import "./App.scss";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Header from "./components/Header";
import { useEffect } from "react";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!/^\/gallery\/[^/]+\/[^/]*$/.test(pathname)) window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Navigate to="/gallery/all" />} />
        <Route path="/gallery/:collection" element={<Gallery />} />
        <Route path="/gallery/:collection/:id" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route path="" element={<Admin />} />
        </Route>
      </Routes>
      <div className="background fixed top-0 left-0 h-screen w-screen z-[-1]"></div>
    </>
  );
}

export default App;
