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
        const collectionsArray = uniqueCollections.map((collectionName) => {
          const collectionPaintings = data.filter(
            (painting) => painting.collection === collectionName
          );
          return {
            name: collectionName,
            url: collectionName.toLowerCase().replace(/\s+/g, "-"),
            photo: collectionPaintings[0].photoM || "",
          };
        });
        collectionsArray.sort((a, b) => a.name.localeCompare(b.name));
        setCollections(collectionsArray);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="fade-in">
      <div className="px-3 sm:px-5">
        <div className="pt-32 pb-20 flex flex-col items-center text-center">
          <h1 className="text-2xl sm:text-3xl font-serif">
            Discover the artistic world of
          </h1>
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-serif italic mt-4">
            Chris Elliott.
          </h1>
          <p className="max-w-xl mt-5">
            With a collection of over 300 stunning paintings and thousands of
            sketches, Chris Elliott"s work captures the beauty of everyday life,
            the vibrant essence of urban landscapes, and the timeless elegance
            of still lifes and portraits.
          </p>
          <Link to="/gallery/all" className="link mt-10">
            View the gallery →
          </Link>
        </div>
        <div className="w-full">
          <p className="border-b">Collections ↓</p>
          <div className="flex flex-col lg:flex-row gap-5 py-5">
            {collections.map((collection) => (
              <Link
                className="w-full"
                to={"/gallery/" + collection.url}
                key={collection.name}
              >
                <p className="font-serif text-2xl pb-1">{collection.name}</p>
                <div className="w-full h-60 lg:h-[500px] overflow-hidden">
                  {collection.photo && (
                    <div
                      className="w-full h-full bg-cover bg-center scale-105 grayscale hover:grayscale-0 hover:scale-110 duration-700 bg-gray-100"
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
