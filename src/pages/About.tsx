import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { getContent } from "../utils/database";
import { formatBiography } from "../utils/utils";
import Loader from "../components/Loader";

function About() {
  const [bio, setBio] = useState<string>("");

  useEffect(() => {
    document.title = "About | Chris Elliott Art Gallery";
    getContent("about", "bio").then(setBio);
  }, []);

  return (
    <>
      <Loader loaded={bio !== ""} />
      <div className="px-3 sm:px-5 mt-14">
        <h1 className="text-7xl sm:text-8xl font-serif mt-40 mb-20 text-center">
          About the Artist
        </h1>
        <div className="flex flex-col lg:flex-row gap-10 justify-center items-center lg:items-start mb-40">
          <img
            className="w-[200px] sm:w-[250px] bg-gray-100 shadow-md"
            src="images/chris-elliott.png"
            alt="Chris Elliott"
          />
          <div className="flex flex-col items-start text-lg gap-5 max-w-2xl">
            {formatBiography(bio)}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;
