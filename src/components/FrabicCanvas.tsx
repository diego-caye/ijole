"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Line,
  Image as KonvaImage,
  Transformer,
} from "react-konva";
import useImage from "use-image";
import Toolbar from "./Toolbar";
import type { KonvaEventObject } from "konva/lib/Node";
import type Konva from "konva";

type OverlayImageType = {
  id: string;
  src: string;
  img: HTMLImageElement | null;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  width: number;
  height: number;
};
type LineType = {
  tool: "draw" | "erase";
  color: string;
  size: number;
  points: number[];
};

type Props = {
  onSaved?: () => void;
};
const DrawingCanvas = ({ onSaved }: Props) => {
  const [imageUrl, setImageUrl] = useState("/miku.jpg");
  const [image] = useImage(imageUrl);
  const [lines, setLines] = useState<LineType[]>([]);

  const isDrawing = useRef(false);

  const [mode, setMode] = useState<"draw" | "erase">("draw");
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);
  const stageRef = useRef<Konva.Stage | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<LineType[]>([]);


  const [scale, setScale] = useState(1);

  const [overlayImages, setOverlayImages] = useState<OverlayImageType[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const layerRef = useRef<Konva.Layer | null>(null);

  const transformerRef = useRef<Konva.Transformer | null>(null);

  const overlayRefs = useRef<Record<string, Konva.Image>>({});



  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current && image) {
        const containerWidth = containerRef.current.offsetWidth;
        const newScale = containerWidth / image.width;
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [image]);

  useEffect(() => {
    if (!selectedId) {
      transformerRef.current?.nodes([]);
      transformerRef.current?.getLayer()?.batchDraw();
      return;
    }

    const selectedNode = overlayRefs.current[selectedId];
    if (selectedNode && transformerRef.current) {
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId, overlayImages]);

  const generateId = () =>
    Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

  const handleOverlayImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imgElement = new window.Image();
      imgElement.src = reader.result as string;
      imgElement.onload = () => {
        const newOverlay: OverlayImageType = {
          id: generateId(),
          src: reader.result as string,
          img: imgElement,
          x: 100,
          y: 100,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          width: imgElement.width,
          height: imgElement.height,
        };
        setOverlayImages((prev) => [...prev, newOverlay]);
        setSelectedId(newOverlay.id);
      };
    };
    reader.readAsDataURL(file);
  };

  const getRelativePointerPosition = (stage: Konva.Stage) => {

    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const pos = stage.getPointerPosition();
    return transform.point(pos);
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {

    const transformerNode = transformerRef.current;

    const clickedOnEmpty =
      e.target === e.target.getStage() ||
      (!e.target.hasName("selectable") && !transformerNode?.children?.includes(e.target));

    if (clickedOnEmpty) {
      setSelectedId(null);
    }

    if (mode !== "draw" && mode !== "erase") return;

    if (!clickedOnEmpty) {
      isDrawing.current = false;
      return;
    }

    isDrawing.current = true;
    const pos = getRelativePointerPosition(e.target.getStage());
    const newLine = { tool: mode, color, size, points: [pos.x, pos.y] };
    linesRef.current.push(newLine);
    setLines([...linesRef.current]);
  };

  const handleMouseMove = (e: KonvaEventObject<PointerEvent>) => {
    if (!isDrawing.current) return;
    const point = getRelativePointerPosition(e.target.getStage());
    const currentLine = linesRef.current[linesRef.current.length - 1];
    currentLine.points = currentLine.points.concat([point.x, point.y]);
    setLines([...linesRef.current]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    setLines([...linesRef.current]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
      linesRef.current = [];
      setLines([]);
      setOverlayImages([]);
      setSelectedId(null);
    };
    reader.readAsDataURL(file);
  };

  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "drawing.jpg";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportCompressed = () => {
    if (!stageRef.current) return null;
    return stageRef.current.toDataURL({
      mimeType: "image/webp",
      quality: 0.9,// Puedes ajustar entre 0.3–0.7
      pixelRatio: 2,
    });
  };

  const handleSaveToApp = () => {
  const dataUrl = exportCompressed();
  if (!dataUrl) return;

  try {
    const saved = JSON.parse(localStorage.getItem("savedImages") || "[]");
    const newSaved = [...saved, dataUrl];
    localStorage.setItem("savedImages", JSON.stringify(newSaved));
    onSaved?.(); // 👈 actualiza galería
  } catch {
    alert("No se pudo guardar. Se alcanzó el límite del navegador.");
  }
};


  const updateOverlayImage = (id: string, newAttrs: Partial<OverlayImageType>) => {
    setOverlayImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...newAttrs } : img))
    );
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    setOverlayImages((prev) => prev.filter((img) => img.id !== selectedId));
    setSelectedId(null);
  };

  if (!image) return <div>Loading...</div>;

  return (
    <div className="md:grid space-y-6 grid-cols-2 md:space-x-12">
      <div ref={containerRef}>
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: image.width,
            height: image.height,
          }}
        >
          <Stage
            width={image.width}
            height={image.height}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            ref={stageRef}
          >
            <Layer>
              <KonvaImage image={image} />
            </Layer>

            {/* Imágenes overlay primero */}
            <Layer ref={layerRef}>
              {overlayImages.map((img) =>
                img.img ? (
                  <KonvaImage
                    name="selectable"
                    key={img.id}
                    id={img.id}
                    ref={(node) => {
                      if (node) {
                        overlayRefs.current[img.id] = node;
                      } else {
                        delete overlayRefs.current[img.id];
                      }
                    }}
                    image={img.img}
                    x={img.x}
                    y={img.y}
                    scaleX={img.scaleX}
                    scaleY={img.scaleY}
                    rotation={img.rotation}
                    draggable
                    onClick={(e) => {
                      e.cancelBubble = true;
                      setSelectedId(img.id);
                    }}
                    onTap={(e) => {
                      e.cancelBubble = true;
                      setSelectedId(img.id);
                    }}
                    onDragStart={() => {
                      setSelectedId(img.id);
                    }}
                    onDragEnd={(e) => {
                      updateOverlayImage(img.id, {
                        x: e.target.x(),
                        y: e.target.y(),
                      });
                    }}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();

                      updateOverlayImage(img.id, {
                        x: node.x(),
                        y: node.y(),
                        rotation: node.rotation(),
                        scaleX,
                        scaleY,
                        width: img.width * scaleX,
                        height: img.height * scaleY,
                      });
                    }}
                  />
                ) : null
              )}
            </Layer>

            {/* Líneas encima */}
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.tool === "erase" ? "white" : line.color}
                  strokeWidth={line.size}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation={
                    line.tool === "erase" ? "destination-out" : "source-over"
                  }
                />
              ))}
            </Layer>

            {/* Transformer siempre visible */}
            <Layer>
              <Transformer
                ref={transformerRef}
                rotateEnabled={true}
                resizeEnabled={true}
                borderEnabled={true}
                anchorSize={8}
                anchorStroke="#666"
                anchorCornerRadius={3}
                borderStroke="#666"
                borderDash={[3, 3]}
                keepRatio={false}
                enabledAnchors={[
                  "top-left",
                  "top-right",
                  "bottom-left",
                  "bottom-right",
                ]}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 30 || newBox.height < 30) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            </Layer>
          </Stage>
        </div>
      </div>

      <Toolbar
        mode={mode}
        setMode={setMode}
        color={color}
        setColor={setColor}
        size={size}
        setSize={setSize}
        onImageChange={handleImageChange}
        onDownloadImage={handleExport}
        onOverlayImageChange={handleOverlayImageChange}
        onDeleteSelected={handleDeleteSelected}
        selectedId={selectedId}
        onSaveToApp={handleSaveToApp}
      />
    </div>
  );
};

export default DrawingCanvas;
