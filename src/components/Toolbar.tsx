"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ColorPicker from "@/components/ui/color-picker";
import { useTranslations } from 'next-intl';

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
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-4 mb-4 items-start w-full">
      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="mode-select">{t('tools')}:</Label>
        <div id="mode-select" className="flex space-x-2">
          <Button
            variant={mode === "draw" ? "default" : "outline"}
            onClick={() => setMode("draw")}
          >
            {t('draw')}
          </Button>
          <Button
            variant={mode === "erase" ? "default" : "outline"}
            onClick={() => setMode("erase")}
          >
            {t('delete')}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="color-picker">{t('color')}:</Label>
        <div id="color-picker">
          <ColorPicker color={color} onChange={setColor} />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="size-slider">
          {t('brush size')}: <span className="ml-2">{size}</span>
        </Label>
        <Slider
          id="size-slider"
          defaultValue={[size]}
          max={100}
          step={1}
          onValueChange={([val]) => setSize(val)}
          aria-label='Size Slider Volume'
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="image-upload">{t('replace background image')}:</Label>
        <Input id="image-upload" type="file" accept="image/*" onChange={onImageChange} />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="overlay-upload">{t('add movable image')}:</Label>
        <Input id="overlay-upload" type="file" accept="image/*" onChange={onOverlayImageChange} />
      </div>
      <Button
        onClick={onDownloadImage}
        className="w-full rounded text-white bg-green-700"
      >
        {t('download image')}Descargar imagen
      </Button>
      {selectedId && (
        <Button
          onClick={onDeleteSelected}
          className="w-full rounded text-white bg-red-800"
        >
          {t('delete selected image')}
        </Button>
      )}

      <Button
        onClick={onSaveToApp}
        className="w-full rounded text-white bg-blue-800"
      >
        {t('save to the app')}
      </Button>

    </div>
  );
};

export default Toolbar;
