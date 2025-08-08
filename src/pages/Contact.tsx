import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { getContent } from "../utils/database";

function Contact() {
  const [description, setDescription] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    document.title = "Contact | Chris Elliott Art Gallery";
    getContent("contact", "description").then(setDescription);
    getContent("contact", "email").then(setEmail);
  }, []);

  return (
    <div className="fade-in">
      <div className="w-full px-3 sm:px-5 flex flex-col gap-5 items-start mb-40">
        <h1 className="text-7xl sm:text-8xl sm:text-9xl font-serif mt-40 mb-10">
          Contact us
        </h1>
        <p className="sm:text-xl">
          {description}
        </p>
        <Link className="button text-xl mb-12" to={`mailto:${email}`}>
          {email}
        </Link>
        <p className="sm:text-xl">Or, just fill out the form below &darr;</p>
        <form className="w-full">
          <div className="flex flex-col sm:flex-row gap-5 sm:text-xl">
            <div className="flex flex-col gap-5">
              <input
                className="big-input max-w-[300px]"
                id="name"
                type="text"
                placeholder="Name"
                required
              />
              <input
                className="big-input max-w-[300px]"
                id="email"
                type="text"
                placeholder="Email"
                required
              />
            </div>
            <div className="flex flex-col items-start gap-5 w-full">
              <textarea
                className="big-input max-w-3xl w-full h-80"
                name="message"
                id="message"
                placeholder="Message"
                required
              />
              <button className="button">Send</button>
            </div>
          </div>
        </form>
      </div>
      <Footer showContactLink={false}></Footer>
    </div>
  );
}

export default Contact;
