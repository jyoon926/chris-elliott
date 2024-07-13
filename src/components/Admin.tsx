import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Painting, Collections, Collection } from '../types';
import { MdSave, MdDelete, MdOutlineAddBox } from 'react-icons/md';
import Modal from './Modal';
import UploadPaintingForm from './Upload';

function Admin() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [selectedCollection, setCollection] = useState<Collection>();

  const filteredPaintings = selectedCollection ? paintings.filter(painting => 
        painting.collection.toLowerCase().replace(/\s+/g, "-") + "s" === selectedCollection.url
  ) : paintings;

  const fetchData = async () => {
    const { data, error } = await supabase.from('paintings').select('*');
    if (error) {
      console.error('Error fetching data:', error);
    } else {
      const uniqueCollections = Array.from(new Set(data.map(painting => painting.collection)));
      let collectionsArray = uniqueCollections.map(collectionName => {
        const collectionPaintings = data.filter(painting => painting.collection === collectionName);
        return {
          name: collectionName,
          url: collectionName.toLowerCase().replace(/\s+/g, "-") + "s",
          photo: collectionPaintings[0]?.photoS || ""
        };
      });
      setPaintings(data.sort((a, b) => a.title.localeCompare(b.title)));
      setCollections(collectionsArray.sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deletePainting = async (id: number) => {
    const { error } = await supabase.from('paintings').delete().eq('id', id);
    if (error) {
      console.error('Error deleting painting:', error);
    } else {
      fetchData();
    }
  };

  const updatePainting = async (updatedPainting: Painting) => {
    const { error } = await supabase
      .from('paintings')
      .update(updatedPainting)
      .eq('id', updatedPainting.id);
    if (error) {
      console.error('Error updating painting:', error);
    } else {
      fetchData();
    }
  };

  const handleChange = (id: number, key: keyof Painting, value: any) => {
    setPaintings(prevPaintings =>
      prevPaintings.map(painting =>
        painting.id === id ? { ...painting, [key]: value } : painting
      )
    );
  };

  return (
    <div className='fade-in'>
      <div className='px-3 sm:px-5 mt-14'>
        <h1 className='text-6xl sm:text-7xl font-serif mt-32 mb-5'>Admin Dashboard</h1>
        <div className='flex flex-row gap-3 py-5'>
          <button className='button flex flex-row justify-center items-center gap-1' onClick={() => setIsModalOpen(true)}><MdOutlineAddBox className='text-xl' /> Upload painting</button>
        </div>
        <div className='flex flex-row flex-wrap border-t py-5 gap-2'>
          <p onClick={() => setCollection(undefined)} className={`border py-1.5 px-3.5 duration-300 rounded cursor-pointer ${
                selectedCollection ? 'hover:bg-light' : 'bg-foreground text-background'
              }`}>All Paintings</p>
          {collections.map(collection => (
            <p key={collection.url} onClick={() => setCollection(collection)} className={`border py-1.5 px-3.5 duration-300 rounded cursor-pointer ${
                  selectedCollection?.url === collection.url ? 'bg-foreground text-background' : 'hover:bg-light'
                }`}>{collection.name}s
            </p>
          ))}
        </div>
        <div className='dashboard w-full mb-32'>
          <table className='w-full'>
            <thead>
              <tr className='border-b'>
                <th>Image</th>
                <th>Title</th>
                <th>Collection</th>
                <th>Medium</th>
                <th>Width</th>
                <th>Height</th>
                <th>Year</th>
                <th>Price</th>
                <th className='purchased'>Purchased</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredPaintings.map(painting => (
                <tr key={painting.id}>
                  <td><img className='h-10 rounded' src={painting.photoS} alt='' /></td>
                  <td><input className='w-80' type='text' value={painting.title} onChange={(e) => handleChange(painting.id, 'title', e.target.value)} /></td>
                  <td>
                    <select value={painting.collection} onChange={(e) => handleChange(painting.id, 'collection', e.target.value)}>
                      {Collections.map(collection => (
                        <option key={collection} value={collection}>{collection}</option>
                      ))}
                    </select>
                  </td>
                  <td><input type='text' value={painting.medium} onChange={(e) => handleChange(painting.id, 'medium', e.target.value)} /></td>
                  <td><input className='w-14' type='number' value={painting.width || ''} onChange={(e) => handleChange(painting.id, 'width', e.target.value)} /></td>
                  <td><input className='w-14' type='number' value={painting.height || ''} onChange={(e) => handleChange(painting.id, 'height', e.target.value)} /></td>
                  <td><input className='w-28' type='text' value={painting.year || ''} onChange={(e) => handleChange(painting.id, 'year', e.target.value)} /></td>
                  <td><input className='w-20' type='number' value={painting.price || ''} onChange={(e) => handleChange(painting.id, 'price', e.target.value)} /></td>
                  <td><input type='checkbox' checked={painting.purchased} onChange={(e) => handleChange(painting.id, 'purchased', e.target.checked)} /></td>
                  <td className='flex flex-row'>
                    <button className='icon save' onClick={() => updatePainting(painting)}><MdSave /></button>
                    <button className='icon delete' onClick={() => deletePainting(painting.id)}><MdDelete /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UploadPaintingForm onClose={() => setIsModalOpen(false)} refreshPaintings={fetchData} defaultCollection={selectedCollection?.name || ''}></UploadPaintingForm>
      </Modal>
    </div>
  )
}

export default Admin;
