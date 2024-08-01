import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Collection, Painting } from "../types";
import { useParams, useNavigate } from "react-router";
import { Link, Navigate } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

function Gallery() {
  const { collection: urlCollection, id: urlPainting } = useParams();
  const navigate = useNavigate();
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selected, setSelected] = useState<number | undefined>();

  const stringToUrl = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
  };

  const urlToString = (url: string): string => {
    return url
      .replace(/-/g, " ") // Replace hyphens with spaces
      .toLowerCase() // Convert to lowercase
      .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase()) // Capitalize the first letter of each word
      .replace(/[^a-zA-Z0-9\s]/g, ""); // Restore special characters if needed
  };

  const filteredPaintings =
    urlCollection !== "all"
      ? paintings.filter(
          (painting) => stringToUrl(painting.collection) === urlCollection
        )
      : paintings;

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("paintings").select("*");
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        let uniqueCollections = Array.from(
          new Set(data.map((painting) => painting.collection))
        );
        let collectionsArray: Collection[] = [
          {
            name: "All Paintings",
            url: "all",
            photo: "",
          },
        ];
        collectionsArray = collectionsArray.concat(
          uniqueCollections
            .map((collectionName) => {
              const collectionPaintings = data.filter(
                (painting) => painting.collection === collectionName
              );
              return {
                name: collectionName,
                url: stringToUrl(collectionName),
                photo: collectionPaintings[0]?.photoS || "",
              };
            })
            .sort((a, b) => a.name.localeCompare(b.name))
        );
        let paintingsArr = data.sort((a, b) => a.order - b.order);
        setPaintings(paintingsArr);
        setCollections(collectionsArray);
        preloadImages(paintingsArr.map((painting) => painting.photoM));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    document.title = `Gallery - ${urlToString(
      urlCollection!
    )} | Chris Elliott Art Gallery`;

    if (urlPainting) {
      const selectedIndex = filteredPaintings.findIndex(
        (painting) => stringToUrl(painting.title) === urlPainting
      );
      setSelected(selectedIndex !== -1 ? selectedIndex : undefined);
    } else {
      setSelected(undefined);
    }
  }, [urlPainting, filteredPaintings]);

  const preloadImages = (imageUrls: any[]) => {
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  };

  const handlePaintingClick = (index: number, painting: Painting) => {
    setSelected(index);
    navigate(`/gallery/${urlCollection}/${stringToUrl(painting.title)}`);
  };

  const handleClose = () => {
    setSelected(undefined);
    navigate(`/gallery/${urlCollection}/`);
  };

  if (filteredPaintings.length === 0) return <></>;

  return (
    <div className="fade-in">
      {paintings.length && filteredPaintings.length === 0 && (
        <Navigate replace to="/gallery/all" />
      )}
      {filteredPaintings.length &&
        urlPainting &&
        !filteredPaintings.find(
          (p) => stringToUrl(p.title) === urlPainting
        ) && <Navigate replace to={`/gallery/${urlCollection}`} />}
      <div className="px-3 sm:px-5 mt-14">
        <h1 className="text-8xl sm:text-9xl font-serif mt-40 mb-16">Gallery</h1>

        {/* Collections */}
        <div className="flex flex-row flex-wrap border-b pb-3 gap-2">
          {collections.map((collection) => (
            <Link
              key={collection.url}
              to={`/gallery/${collection.url}`}
              className={`border py-1.5 px-3.5 duration-300 rounded ${
                urlCollection === collection.url
                  ? "bg-foreground text-background"
                  : "hover:bg-light"
              }`}
            >
              {collection.name}
            </Link>
          ))}
        </div>

        {/* Paintings */}
        <div
          className="w-full grid gap-5 mt-5 mb-16"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          }}
        >
          {filteredPaintings.map((painting, i) => (
            <div key={painting.id}>
              <Link
                to={`/gallery/${urlCollection}/${stringToUrl(painting.title)}`}
                onClick={() => handlePaintingClick(i, painting)}
                className="painting-card flex flex-col gap-3 mb-3"
              >
                <div className="flex flex-col justify-center items-center text-center">
                  <img
                    className={"w-full duration-300 bg-gray-100"}
                    src={painting.photoM}
                    alt=""
                  />
                  <div className="text opacity-0 absolute text-background duration-400 leading-5">
                    {painting.price &&
                      painting.display_price &&
                      (painting.purchased ? (
                        <p>${painting.price}</p>
                      ) : (
                        <p>
                          <span className="line-through">
                            ${painting.price}
                          </span>{" "}
                          <span className="opacity-60">Sold</span>
                        </p>
                      ))}
                    <p>{painting.collection}</p>
                    <p>{painting.location}</p>
                    <p>{painting.medium}</p>
                    {painting.width && painting.height && (
                      <p>
                        {painting.width} x {painting.height} in.
                      </p>
                    )}
                  </div>
                </div>
                <p className="font-serif text-xl">{painting.title}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Slideshow */}
      <div
        className={
          "fixed inset-0 z-50 bg-white bg-opacity-75 backdrop-blur flex flex-col md:justify-center items-center gap-10 duration-500 " +
          (selected === undefined && "opacity-0 pointer-events-none")
        }
      >
        {selected !== undefined && (
          <>
            <div className="w-full flex flex-col justify-center items-center gap-10 md:gap-0">
              <div className="w-full px-3 pt-12 md:py-20 flex flex-col md:flex-row gap-5 md:gap-8 justify-center items-center">
                <div className="w-full md:w-1/5">
                  <p className="opacity-50 mb-2">
                    {filteredPaintings[selected].collection}
                    {filteredPaintings[selected].year && (
                      <span> — {filteredPaintings[selected].year}</span>
                    )}
                  </p>
                  <p className="font-serif text-3xl mb-5">
                    {filteredPaintings[selected].title}
                  </p>
                  {filteredPaintings[selected].price &&
                    filteredPaintings[selected].display_price &&
                    (filteredPaintings[selected].purchased ? (
                      <p>${filteredPaintings[selected].price}</p>
                    ) : (
                      <p>
                        <span className="line-through">
                          ${filteredPaintings[selected].price}
                        </span>{" "}
                        <span className="opacity-60">Sold</span>
                      </p>
                    ))}
                  <p>{filteredPaintings[selected].medium}</p>
                  <p>{filteredPaintings[selected].location}</p>
                  {filteredPaintings[selected].width &&
                    filteredPaintings[selected].height && (
                      <p>
                        {filteredPaintings[selected].width} x{" "}
                        {filteredPaintings[selected].height} in.
                      </p>
                    )}
                </div>
                <div className="w-full md:w-1/2 flex md:justify-center items-center">
                  <img
                    className="max-w-full painting-main"
                    key={filteredPaintings[selected].id}
                    src={filteredPaintings[selected].photoM}
                    alt=""
                  />
                </div>
              </div>
              <div className="w-full fixed bottom-3 md:bottom-auto flex justify-between items-center px-3 md:px-5">
                <button
                  className="text-2xl cursor-pointer"
                  onClick={() =>
                    handlePaintingClick(
                      selected - 1,
                      filteredPaintings[selected - 1]
                    )
                  }
                  disabled={selected === 0}
                >
                  <AiOutlineArrowLeft />
                </button>
                <button
                  className="text-2xl cursor-pointer"
                  onClick={() =>
                    handlePaintingClick(
                      selected + 1,
                      filteredPaintings[selected + 1]
                    )
                  }
                  disabled={selected === filteredPaintings.length - 1}
                >
                  <AiOutlineArrowRight />
                </button>
              </div>
            </div>
            <button className="link fixed top-5 right-5" onClick={handleClose}>
              Close
            </button>
          </>
        )}
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Gallery;
