import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Collection } from "../types";
import { getCollections, getContent } from "../utils/database";
import Loader from "../components/Loader";

function Home() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    document.title = "Home | Chris Elliott Art Gallery";
    getCollections().then(setCollections);
    getContent("home", "description").then(setDescription);
  }, []);

  return (
    <>
      <Loader loaded={description !== "" && collections.length > 0} />
      <div className="px-3 sm:px-5">
        <div className="pt-48 pb-32 flex flex-col items-center text-center">
          <h1 className="text-2xl sm:text-3xl font-serif leading-none">
            Discover the artistic world of
          </h1>
          <h1 className="text-[14vw] md:text-[7rem] lg:text-[8rem] font-serif italic leading-none mt-7">
            Chris Elliott
          </h1>
          <p className="max-w-2xl mt-10">{description}</p>
          <Link to="/gallery/all" className="button mt-12">
            View the gallery
          </Link>
        </div>
        {collections.length > 0 && (
          <div className="w-full">
            <div className="bg-white mb-10 p-5 flex flex-col lg:flex-row gap-5">
              {collections.map((collection) => (
                <Link
                  className="w-full"
                  to={"/gallery/" + collection.url}
                  key={collection.name}
                >
                  <p className="font-serif text-2xl pb-2">{collection.name}</p>
                  <div className="w-full h-60 lg:h-[500px] overflow-hidden">
                    {collection.photo && (
                      <div
                        className="w-full h-full bg-cover bg-center scale-105 hover:scale-110 duration-700 bg-gray-100"
                        style={{ backgroundImage: `url("${collection.photo}")` }}
                      ></div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer></Footer>
    </>
  );
}

export default Home;
