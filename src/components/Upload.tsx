import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Collections } from '../types';
import Compressor from 'compressorjs';

interface UploadPaintingFormProps {
  onClose: () => void;
  refreshPaintings: () => void;
}

const UploadPaintingForm: React.FC<UploadPaintingFormProps> = ({ onClose, refreshPaintings }) => {
  const [title, setTitle] = useState<string>('');
  const [collection, setCollection] = useState<string>('');
  const [medium, setMedium] = useState<string>('');
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [purchased, setPurchased] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    if (file) {
      const photoLFile = new File([await compress(file, 0.9, 2000) as Blob], "L-" + file.name, { type: file.type });
      const photoMFile = new File([await compress(file, 0.8, 1000) as Blob], "M-" + file.name, { type: file.type });
      const photoSFile = new File([await compress(file, 0.6, 500) as Blob], "S-" + file.name, { type: file.type });

      const { data: dataL, error: uploadErrorL } = await supabase.storage.from('paintings').upload(photoLFile.name, photoLFile);
      const { data: dataM, error: uploadErrorM } = await supabase.storage.from('paintings').upload(photoMFile.name, photoMFile);
      const { data: dataS, error: uploadErrorS } = await supabase.storage.from('paintings').upload(photoSFile.name, photoSFile);

      if (uploadErrorL || uploadErrorM || uploadErrorS) {
        console.error('Error uploading file');
        return;
      }

      const photoL = supabase.storage.from('paintings').getPublicUrl(dataL.path).data.publicUrl;
      const photoM = supabase.storage.from('paintings').getPublicUrl(dataM.path).data.publicUrl;
      const photoS = supabase.storage.from('paintings').getPublicUrl(dataS.path).data.publicUrl;

      const { error } = await supabase
        .from('paintings')
        .insert([{ title, collection, medium, width, height, year, location, price, purchased, photoS, photoM, photoL }]);
      if (error) {
        console.error('Error uploading painting:', error);
      } else {
        refreshPaintings();
        setUploading(false);
        onClose();
      }
    }
  };

  const compress = (file: File, quality: number, maxWidth: number) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality,
        maxWidth,
        success: resolve,
        error: reject
      });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="upload w-full space-y-2">
      <div className="flex flex-row gap-3 justify-start items-center">
        <label className="w-24 text-right">Photo*</label>
        <input type="file" onChange={handleFileChange} required />
      </div>
      <div className="flex flex-row gap-3 justify-start items-center">
        <label className="w-24 text-right">Title*</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="border rounded px-2 py-1" />
      </div>
      <div className="flex flex-row gap-3 justify-start items-center">
        <label className="w-24 text-right">Collection*</label>
        <select value={collection} onChange={(e) => setCollection(e.target.value)} required className="border rounded px-2 py-1">
          <option value=""></option>
          {Collections.map(collection => (
            <option key={collection} value={collection}>{collection}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-row gap-3 justify-start items-center">
        <label className="w-24 text-right">Medium*</label>
        <input type="text" value={medium} onChange={(e) => setMedium(e.target.value)} required className="border rounded px-2 py-1" />
      </div>
      <div className="flex flex-row gap-3 justify-start items-center">
        <label className="w-24 text-right">Width</label>
        <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="border rounded px-2 py-1" />
      </div>
      <div className="flex flex-row gap-3 justify-start items-center">
        <label className="w-24 text-right">Height</label>
        <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="border rounded px-2 py-1" />
      </div>
      <div className="flex flex-row gap-3 justify-start items-center">
        <label className="w-24 text-right">Year</label>
        <input type="text" value={year} onChange={(e) => setYear(e.target.value)} className="border rounded px-2 py-1" />
      </div>
      <div className="flex flex-row gap-3 justify-start items-center">
        <label className="w-24 text-right">Location</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="border rounded px-2 py-1" />
      </div>
      <div className="flex flex-row gap-3 justify-start items-center">
        <label className="w-24 text-right">Price</label>
        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="border rounded px-2 py-1" />
      </div>
      <div className="flex flex-row gap-3 justify-start items-center">
        <label className="w-24 text-right">Purchased</label>
        <input type="checkbox" checked={purchased} onChange={(e) => setPurchased(e.target.checked)} />
      </div>
      <div className="text-right">
        <button type="submit" className="button">
          {uploading 
            ? <div className="spinner my-1"></div>
            : <span>Upload</span>
          }
        </button>
      </div>
    </form>
  );
};

export default UploadPaintingForm;
