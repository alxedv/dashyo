"use client";

import { Map, Marker, Overlay, Point } from 'pigeon-maps';
import React, { useEffect, useRef, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { customersAtom, filterAtom, locationSelectedAtom, representativesAtom, updateCustomerAtom } from '@/store';
import { getLocation } from '@/lib/actions/customer.action';
import CustomModal from './CustomModal';
import UpdateCustomerModal from './UpdateCustomerModal';
import GeolocationSelect from './GeolocationSelect';
import RepresentativeIcon from '../public/icons/plasson-icon.jpg';
import Image from 'next/image';
import SelectSupervisor from './SelecSupervisor';
import { CustomerTooltip } from './CustomerTooltip';

const CustomerMap = ({ customers, representatives, supervisors }) => {
  const [center, setCenter] = useState([-21.723709994933873, -50.72346522754347]);
  const [currentCustomers, setCurrentCustomers] = useAtom(customersAtom);
  const [currentReps, setCurrentReps] = useAtom(representativesAtom);
  const [zoom, setZoom] = useState(14);
  const [openModal, setOpenModal] = useState(false);
  const [updateCustomerData, setUpdateCustomerData] = useAtom(updateCustomerAtom);
  const setLocationSelected = useSetAtom(locationSelectedAtom);
  const spanRefs = useRef([]); // Array de refs para spans
  const [spanWidths, setSpanWidths] = useState([]);
  const filter = useAtomValue(filterAtom);
  const [mouseHover, setMouseHover] = useState({
    isHover: false,
    customer: {},
  });

  useEffect(() => {
    const filteredCustomers = filter.supervisor !== "Todos"
      ? customers.filter(customer => customer.supervisorId === filter.supervisor)
      : customers;

    setCurrentCustomers(filteredCustomers.map(customer => ({
      ...customer,
      equipments: customer?.equipments,
    })));
  }, [customers, filter, setCurrentCustomers]);

  useEffect(() => {
    setCurrentReps(representatives);
  }, [representatives]);

  useEffect(() => {
    const widths = spanRefs.current.map(span => span?.offsetWidth || 0);
    setSpanWidths(widths);
  }, [currentReps]);

  const calculateOffset = (zoom, imageWidth, imageHeight) => {
    const xOffset = imageWidth / 2 / (zoom / 10);
    const yOffset = imageHeight / (zoom / 10);
    return [xOffset, yOffset];
  };

  function getColor(m) {
    const today = new Date();
    const nextVisitDate = new Date(m.nextVisitDate);

    if (isNaN(nextVisitDate.getTime())) {
      return "Datas inválidas";
    }

    // Verifica se a data da visita é anterior a hoje
    return today.getTime() > nextVisitDate.getTime() ? "red" : "green";
  }

  return (
    <div className="w-full flex flex-col justify-center gap-2 p-4">
      <CustomModal open={openModal} setOpen={() => setOpenModal(!openModal)} />
      <CustomerTooltip isOpen={mouseHover.isHover} customer={mouseHover.customer} />
      <UpdateCustomerModal
        open={updateCustomerData.updateModalOpen}
        setOpen={() => setUpdateCustomerData({ ...updateCustomerData, updateModalOpen: !updateCustomerData.updateModalOpen })}
      />
      <div className='flex w-[900px]'>
        <GeolocationSelect setCenter={setCenter} setZoom={setZoom} />
        <SelectSupervisor supervisors={supervisors} />
      </div>
      <Map
        height={800}
        center={center as Point}
        zoom={zoom}
        onBoundsChanged={({ center, zoom }) => {
          setCenter(center);
          setZoom(zoom);
        }}
        onClick={async (e) => {
          const address = await getLocation(e.latLng[0], e.latLng[1]);

          setLocationSelected({ lat: e.latLng[0], lng: e.latLng[1], ...address });
          setOpenModal(true);
        }}
      >
        {currentCustomers?.map(m => (
          <Marker
            key={m.lat}
            width={50}
            anchor={[m.lat, m.lng]}
            onClick={() => setUpdateCustomerData({ updateModalOpen: true, customer: m })}
            color={getColor(m)}
            onMouseOver={() => setMouseHover({ customer: m, isHover: true })}
            onMouseOut={() => setMouseHover({ customer: {}, isHover: false })}
          >
          </Marker>
        ))}
        {currentReps?.map((rep, index) => (
          <Overlay
            key={`coord-${index}`}
            offset={[spanWidths[index] / 2, 50]}
            anchor={[rep.lat, rep.lng]}
          >
            <div className="flex-col flex items-center">
              <span
                ref={el => { spanRefs.current[index] = el; }} // Não retorna nada
                className="bg-white px-2 rounded-lg text-red-600 mb-2"
              >
                {rep.name}
              </span>
              <Image
                alt="representative-icon"
                src={RepresentativeIcon}
                width={50}
                height={50}
                className="rounded border-2 border-red-600"
              />
            </div>
          </Overlay>
        ))}
      </Map>
    </div>
  );
};

export default CustomerMap;
