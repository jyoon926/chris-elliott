import "./App.css"
import { Routes, Route, useLocation } from "react-router-dom"
import Home from "./components/Home"
import Gallery from "./components/Gallery"
import About from "./components/About"
import Contact from "./components/Contact"
import Header from "./components/Header"
import { useEffect } from "react"

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
      </Routes>
    </>
  )
}

export default App
