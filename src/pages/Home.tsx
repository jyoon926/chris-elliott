import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Link } from "react-router-dom";
import { Collection } from "../types";

function Home() {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    document.title = "Home | Chris Elliott Art Gallery";

    const fetchData = async () => {
      const { data, error } = await supabase.from("paintings").select("*");
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        data.sort((a, b) => a.order - b.order);
        const uniqueCollections = Array.from(
          new Set(data.map((painting) => painting.collection))
        );
        const collectionsArr = uniqueCollections.map((collectionName) => {
          const collectionPaintings = data.filter(
            (painting) => painting.collection === collectionName
          );
          return {
            name: collectionName,
            url: collectionName.toLowerCase().replace(/\s+/g, "-"),
            photo: collectionPaintings[0].photoM || "",
          };
        });
        setCollections(collectionsArr);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="fade-in">
      <div className="px-3 sm:px-5">
        <div className="pt-48 pb-32 flex flex-col items-center text-center">
          <h1 className="text-2xl sm:text-3xl font-serif leading-none">
            Discover the artistic world of
          </h1>
          <h1 className="text-[14vw] md:text-[8rem] lg:text-[9rem] font-serif italic leading-none mt-7">
            Chris Elliott
          </h1>
          <p className="max-w-xl mt-10">
            With a collection of over 300 stunning paintings and sketches, Chris Elliott's work captures the beauty of everyday life, the vibrant essence of urban landscapes, and the timeless elegance of still lifes and portraits.
          </p>
          <Link to="/gallery/all" className="button mt-12">
            View the gallery
          </Link>
        </div>
        <div className="w-full">
          {/* <p className="border-b">Collections ↓</p> */}
          <div className="border-t py-5 flex flex-col lg:flex-row gap-5">
            {collections.map((collection) => (
              <Link
                className="w-full"
                to={"/gallery/" + collection.url}
                key={collection.name}
              >
                <p className="font-serif text-2xl pb-2">{collection.name}</p>
                <div className="w-full h-60 lg:h-[500px] rounded overflow-hidden">
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
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Home;
