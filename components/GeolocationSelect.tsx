import React, { useState } from 'react';
import { debounce } from '@/lib/utils';
import { searchLocation } from '@/lib/geolocation';
import AsyncSelect from 'react-select/async';
import { RiSearchLine } from '@remixicon/react';

export default function GeolocationSelect({
  setCenter,
  setZoom,
}) {

  const promiseOptions = (inputValue: string) =>
    new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve(searchLocation(inputValue));
      }, 1000);
    });


  return (
    <div className='flex items-center gap-2 px-4'>
      <RiSearchLine />
      <AsyncSelect
        className="w-[400px]"
        placeholder="Busque por rua, cidade, estado..."
        loadOptions={promiseOptions}
        onChange={(e: any) => {
          setCenter([e.lat, e.lng]);
          setZoom(18);
        }}
      />
    </div>
  );
}
