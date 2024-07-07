import { Link } from "react-router-dom"
import Footer from "./Footer"

function Contact() {
  return (
    <>
      <div className="w-full px-5 flex flex-col gap-5 items-start mb-40">
        <h1 className="text-9xl font-serif mt-40 mb-10">Contact us</h1>
        <p className="text-xl">Curious about the art collection, or interested in purchasing a piece? Send us a message!</p>
        <Link className="button text-xl mb-12" to="mailto:example@gmail.com">example&#64;gmail.com ↗</Link>
        <p className="text-xl">Or, just fill out the form below &darr;</p>
        <form className="w-full">
          <div className="flex flex-row gap-5 text-xl">
            <div className="flex flex-col gap-5">
              <input className="w-[300px]" id="name" type="text" placeholder="Name" required />
              <input className="w-[300px]" id="email" type="text" placeholder="Email" required />
            </div>
            <div className="flex flex-col items-start gap-5 w-full">
              <textarea className="max-w-3xl w-full h-80" name="message" id="message" placeholder="Message" required />
              <button className="button">Send</button>
            </div>
          </div>
        </form>
      </div>
      <Footer showContactLink={false}></Footer>
    </>
  )
}

export default Contact
