"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { Button } from "@/components/ui/button";
type Props = {
  refreshTrigger: number;
};

const SavedImages = ({ refreshTrigger }: Props) => {
  const [savedImages, setSavedImages] = useState<string[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("savedImages") || "[]");
    setSavedImages(data);
  }, [refreshTrigger]);

  const handleDelete = (index: number) => {
    const newImages = [...savedImages];
    newImages.splice(index, 1);
    setSavedImages(newImages);
    localStorage.setItem("savedImages", JSON.stringify(newImages));
  };
  
  if (savedImages.length === 0) return null;

  return (
    <PhotoProvider>
    <div>
      <h2 className="text-xl font-bold mb-4">Tus dibujos guardados</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {savedImages.map((src, idx) => (
          <div key={idx} className="relative aspect-video bg-gray-100 rounded overflow-hidden">
            <PhotoView src={src}>
            <Image
              src={src}
              alt={`Dibujo ${idx + 1}`}
              fill
              style={{ objectFit: "cover" }}
            />
            </PhotoView>
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 z-50"
              onClick={() => handleDelete(idx)}
            >
              ×
            </Button>

          </div>
        ))}
      </div>
    </div>
    </PhotoProvider>
  );
};

export default SavedImages;
