import Footer from "../components/Footer";
import { useCallback, useEffect, useState } from "react";
import { Collection, Painting } from "../types";
import { useParams, useNavigate } from "react-router";
import { Link, Navigate } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { getCollectionsFromPaintings, getPaintings } from "../utils/database";
import { preloadImages, stringToUrl, toSentenceCase, urlToString } from "../utils/utils";
import Loader from "../components/Loader";

function Gallery() {
  const { collection: urlCollection, id: urlPainting } = useParams();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selected, setSelected] = useState<number | undefined>();

  const filteredPaintings =
    urlCollection !== "all"
      ? paintings.filter(
        (painting) => stringToUrl(painting.collection) === urlCollection
      )
      : paintings;

  // Fetch paintings and collections, and preload images
  useEffect(() => {
    getPaintings().then(p => {
      setPaintings(p);
      setCollections(getCollectionsFromPaintings(p));
      preloadImages(p.map((painting) => painting.photoM));
      setLoaded(true);
    })
  }, []);

  useEffect(() => {
    document.title = `Gallery - ${urlToString(urlCollection!)} | Chris Elliott Art Gallery`;

    if (urlPainting) {
      const selectedIndex = filteredPaintings.findIndex(
        (painting) => stringToUrl(painting.title) === urlPainting
      );
      setSelected(selectedIndex !== -1 ? selectedIndex : undefined);
    } else {
      setSelected(undefined);
    }
  }, [urlPainting, filteredPaintings, urlCollection]);

  const handlePaintingClick = useCallback(
    (index: number, painting: Painting) => {
      setSelected(index);
      navigate(`/gallery/${urlCollection}/${stringToUrl(painting.title)}`);
    },
    [navigate, urlCollection]
  );

  const handleClose = useCallback(() => {
    setSelected(undefined);
    navigate(`/gallery/${urlCollection}/`);
  }, [navigate, urlCollection]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (selected !== undefined) {
        switch (event.key) {
          case "ArrowLeft":
            if (selected > 0) {
              handlePaintingClick(
                selected - 1,
                filteredPaintings[selected - 1]
              );
            }
            break;
          case "ArrowRight":
            if (selected < filteredPaintings.length - 1) {
              handlePaintingClick(
                selected + 1,
                filteredPaintings[selected + 1]
              );
            }
            break;
          case "Escape":
            handleClose();
            break;
        }
      }
    },
    [selected, filteredPaintings, handleClose, handlePaintingClick]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <Loader loaded={loaded} />
      {paintings.length && filteredPaintings.length === 0 && (
        <Navigate replace to="/gallery/all" />
      )}
      {filteredPaintings.length &&
        urlPainting &&
        !filteredPaintings.find(
          (p) => stringToUrl(p.title) === urlPainting
        ) && <Navigate replace to={`/gallery/${urlCollection}`} />}
      <div className="mt-14">
        <h1 className="px-5 text-8xl sm:text-9xl font-serif mt-40 mb-16">
          Gallery
        </h1>
        {filteredPaintings.length === 0 ? (
          // No paintings
          <p className="w-full px-5 opacity-50">
            No paintings.
          </p>
        ) : (
          <div className="mx-5 mb-10">
            {/* Collections */}
            <div className="flex flex-row flex-wrap mb-2 gap-2">
              {collections.map((collection) => (
                <Link
                  key={collection.url}
                  to={`/gallery/${collection.url}`}
                  className={`py-1.5 px-4 duration-300 bg-white text-foreground ${urlCollection !== collection.url && "opacity-50 hover:opacity-80"
                    }`}
                >
                  {collection.name}
                </Link>
              ))}
            </div>

            {/* Paintings */}
            <div
              className="w-full grid gap-5 p-5 sm:gap-10 sm:p-10 bg-white"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              }}
            >
              {filteredPaintings.map((painting, i) => (
                <div key={painting.id}>
                  <Link
                    to={`/gallery/${urlCollection}/${stringToUrl(
                      painting.title
                    )}`}
                    onClick={() => handlePaintingClick(i, painting)}
                    className="painting-card flex flex-col gap-4"
                  >
                    <div className="flex flex-col justify-center items-center text-center">
                      <img
                        className={
                          "w-full duration-300"
                        }
                        src={painting.photoM}
                        alt=""
                      />
                      <div className="text opacity-0 absolute text-white duration-400 leading-6">
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
                        <p>{toSentenceCase(painting.medium!)}</p>
                        {painting.width && painting.height && (
                          <p>
                            {painting.width} x {painting.height} in.
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="font-serif text-xl capitalize">
                      {painting.title}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Slideshow */}
      <div
        className={
          "fixed inset-0 z-50 bg-white bg-opacity-80 backdrop-blur-xl flex flex-col md:justify-center items-center gap-10 duration-500 " +
          (selected === undefined && "opacity-0 pointer-events-none")
        }
      >
        {selected !== undefined && (
          <>
            <div className="w-full flex flex-col justify-center items-center gap-10 md:gap-0">
              <div className="w-full px-5 pt-24 md:py-20 flex flex-col md:flex-row gap-5 md:gap-8 justify-center items-center">
                <div className="w-full md:w-1/5">
                  <p className="opacity-50 mb-2">
                    {filteredPaintings[selected].collection}
                    {filteredPaintings[selected].year && (
                      <span> — {filteredPaintings[selected].year}</span>
                    )}
                  </p>
                  <p className="font-serif text-3xl mb-5 capitalize">
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
                  <p>
                    {toSentenceCase(filteredPaintings[selected].medium!)}
                  </p>
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
                    className="max-w-full painting-main shadow-lg"
                    key={filteredPaintings[selected].id}
                    src={filteredPaintings[selected].photoM}
                    alt=""
                  />
                </div>
              </div>
              <div className="w-full fixed bottom-3 md:bottom-auto flex justify-between items-center px-5 md:px-5">
                <button
                  className="text-2xl cursor-pointer p-2"
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
                  className="text-2xl cursor-pointer p-2"
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
            <button className="link fixed top-5 left-5" onClick={handleClose}>
              Close
            </button>
          </>
        )}
      </div>
      <Footer></Footer>
    </>
  );
}

export default Gallery;
