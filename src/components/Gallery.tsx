import Footer from "./Footer"
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { Collection, Painting } from "../types";
import { useParams } from 'react-router';
import { Link, Navigate } from "react-router-dom";

function Gallery() {
  const { collection: urlCollection } = useParams();
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  const filteredPaintings = urlCollection ? paintings.filter(painting => 
        painting.collection.toLowerCase().replace(/\s+/g, "-") + "s" === urlCollection
  ) : paintings;

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('paintings').select('*');
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        const uniqueCollections = Array.from(new Set(data.map(painting => painting.collection)));
        const collectionsArray = uniqueCollections.map(collectionName => {
          const collectionPaintings = data.filter(painting => painting.collection === collectionName);
          return {
            name: collectionName,
            url: collectionName.toLowerCase().replace(/\s+/g, "-") + "s",
            photo: collectionPaintings[0]?.photoS || ""
          };
        });
        setPaintings(data);
        setCollections(collectionsArray);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {(urlCollection && filteredPaintings.length === 0) && <Navigate replace to="/gallery" />}
      <div className='px-5 mt-14'>
        <h1 className='text-9xl font-serif mt-40 mb-16'>Gallery</h1>
        <div className='flex flex-row border-b pb-3 gap-3'>
          <Link to="/gallery" className={`border py-1.5 px-3.5 duration-300 ${
                urlCollection ? 'hover:bg-foreground/10' : 'bg-foreground text-background'
              }`}>All Paintings</Link>
          {collections.map(collection => (
            <Link key={collection.url} to={'/gallery/' + collection.url} className={`border py-1.5 px-3.5 duration-300 ${
                  urlCollection === collection.url ? 'bg-foreground text-background' : 'hover:bg-foreground/10'
                }`}>{collection.name}s
            </Link>
          ))}
        </div>
        <div className="w-full grid gap-5 mt-5 mb-16" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'}}>
          {filteredPaintings.map(painting => (
            <div key={painting.id}>
              <Link to="" className="painting-card flex flex-col gap-3">
                <div className='flex flex-col justify-center items-center text-center'>
                  <img className='w-full duration-300' src={painting.photoS} alt="" />
                  <div className='text opacity-0 absolute text-background duration-400 leading-5'>
                    {painting.price && (
                      painting.purchased ? <p>${painting.price}</p> : <p><span className='line-through'>${painting.price}</span> <span className='opacity-60'>Sold</span></p>
                    )}
                    <p>{painting.collection}</p>
                    <p>{painting.location}</p>
                    <p>{painting.medium}</p>
                    {(painting.width && painting.height) && <p>{painting.width} x {painting.height} in.</p>}
                  </div>
                </div>
                <div className='flex flex-row justify-between'>
                  <p className='font-serif text-xl'>{painting.title}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer></Footer>
    </>
  )
}

export default Gallery
