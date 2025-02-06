import React, { useRef, useEffect, useState } from "react";

interface Text {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const Campo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [texts, setTexts] = useState<Text[]>([
    { text: "Hello", x: 20, y: 20, width: 0, height: 16 },
    { text: "World", x: 20, y: 70, width: 0, height: 16 },
  ]);
  const [selectedText, setSelectedText] = useState<number | null>(null);
  const [startPosition, setStartPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.font = "16px verdana";
        texts.forEach((text, index) => {
          text.width = ctx.measureText(text.text).width;
        });
        draw(ctx);
      }
    }
  }, [texts]);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    texts.forEach((text) => {
      ctx.fillText(text.text, text.x, text.y);
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;
      texts.forEach((text, index) => {
        if (textHittest(startX, startY, text)) {
          setSelectedText(index);
        }
      });
      setStartPosition({ x: startX, y: startY });
    }
  };

  const handleMouseUp = () => {
    setSelectedText(null);
    setStartPosition(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (selectedText === null || startPosition === null) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const dx = mouseX - startPosition.x;
      const dy = mouseY - startPosition.y;
      setStartPosition({ x: mouseX, y: mouseY });
      setTexts((prevTexts) =>
        prevTexts.map((text, index) =>
          index === selectedText
            ? { ...text, x: text.x + dx, y: text.y + dy }
            : text
        )
      );
    }
  };

  const textHittest = (x: number, y: number, text: Text) => {
    return x >= text.x && x <= text.x + text.width && y >= text.y - text.height && y <= text.y;
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseUp}
      style={{
        backgroundColor: 'green',
      }}
    />
  );
};

export default Campo;
