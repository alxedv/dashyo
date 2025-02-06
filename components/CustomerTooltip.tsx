'use client'

import { useState, useEffect } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Customer {
  name: string;
  city: string;
  uf: string;
}

export function CustomerTooltip({ isOpen, customer }) {
  const { name, city, uf } = customer;
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    console.log(position);


    if (isOpen) {
      window.addEventListener('mousemove', updatePosition);
    }

    return () => {
      window.removeEventListener('mousemove', updatePosition);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip open={isOpen}>
        <TooltipTrigger asChild>
          <div
            className="fixed"
            style={{ left: position.x, top: position.y }}
          />
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="start"
          className="w-[200px] bg-white shadow-xl"
          style={{
            position: 'fixed',
            left: `${(position.x - 100) / 100}px`,
            top: `${(position.y - 500) / 10}px`
          }}
        >
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">
              {city}, {uf}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}