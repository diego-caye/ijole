"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ColorPicker from "@/components/ui/color-picker";

type ToolbarProps = {
  mode: "draw" | "erase";
  setMode: (mode: "draw" | "erase") => void;
  color: string;
  setColor: (color: string) => void;
  size: number;
  setSize: (size: number) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadImage: () => void;
  onOverlayImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteSelected: () => void;
  selectedId: string | null;
  onSaveToApp: () => void;

};

const Toolbar = ({
  mode,
  setMode,
  color,
  setColor,
  size,
  setSize,
  onImageChange,
  onDownloadImage,
  onOverlayImageChange,
  onDeleteSelected,
  selectedId,
  onSaveToApp
}: ToolbarProps) => {
  return (
    <div className="flex flex-col gap-4 mb-4 items-start w-full">
      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="mode-select">Herramienta:</Label>
        <div id="mode-select" className="flex space-x-2">
          <Button
            variant={mode === "draw" ? "default" : "outline"}
            onClick={() => setMode("draw")}
          >
            Dibujar
          </Button>
          <Button
            variant={mode === "erase" ? "default" : "outline"}
            onClick={() => setMode("erase")}
          >
            Borrar
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="color-picker">Color:</Label>
        <div id="color-picker">
          <ColorPicker color={color} onChange={setColor} />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="size-slider">
          Tamaño del pincel: <span className="ml-2">{size}</span>
        </Label>
        <Slider
          id="size-slider"
          defaultValue={[size]}
          max={100}
          step={1}
          onValueChange={([val]) => setSize(val)}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="image-upload">Reemplazar imagen de fondo:</Label>
        <Input id="image-upload" type="file" accept="image/*" onChange={onImageChange} />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="overlay-upload">Agregar imagen movible:</Label>
        <Input id="overlay-upload" type="file" accept="image/*" onChange={onOverlayImageChange} />
      </div>
      <Button
        onClick={onDownloadImage}
        className="w-full rounded text-white bg-green-400"
      >
        Descargar imagen
      </Button>
      {selectedId && (
        <Button
          onClick={onDeleteSelected}
          className="w-full rounded text-white bg-red-500"
        >
          Eliminar imagen seleccionada
        </Button>
      )}

      <Button
        onClick={onSaveToApp}
        className="w-full rounded text-white bg-blue-500"
      >
        Guardar en la aplicación
      </Button>

    </div>
  );
};

export default Toolbar;
