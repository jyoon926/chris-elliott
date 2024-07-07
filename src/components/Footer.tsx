import { Link } from "react-router-dom"

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

function Footer({showContactLink = true}) {
  return (
    <div className="w-full flex flex-col px-5">
      {
        showContactLink && 
          <div className="w-full flex flex-col items-center border-t py-32 gap-8">
            <p className="text-5xl text-center font-serif">Interested in purchasing a piece?</p>
            <Link to="/contact" className="link text-xl">Get in touch <span>&rarr;</span></Link>
          </div>
      }
      <div className="w-full pt-4 overflow-hidden border-t">
        <div className="w-full flex flex-row justify-between">
          <p>© 2024 Copyright</p>
          <button onClick={scrollToTop}>Back to top ↑</button>
        </div>
        <p className="font-serif h-[15vw] leading-[1.25] text-nowrap tracking-[-.5vw] opacity-10" style={{fontSize: 'calc(23vw - 10px)'}}>Chris Elliott</p>
      </div>
    </div>
  )
}

export default Footer
