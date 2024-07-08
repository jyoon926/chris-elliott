import "./App.scss"
import { Routes, Route, useLocation } from "react-router-dom"
import Home from "./components/Home"
import Gallery from "./components/Gallery"
import About from "./components/About"
import Contact from "./components/Contact"
import Header from "./components/Header"
import { useEffect } from "react"
import Login from "./components/Login"
import Admin from "./components/Admin"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:collection" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route path="" element={<Admin />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
