"use client";

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { useAtom } from 'jotai';
import { representativesAtom } from '@/store';
import { americaPrefixes, formatPhoneNumber } from '@/lib/utils';
import Image from 'next/image';
import { deleteRepresentative, getRepresentatives } from '@/lib/actions/representative.action';
import MoonLoader from 'react-spinners/MoonLoader';

const RepresentativesTable = () => {
  const [currentReps, setRepresentatives] = useAtom(representativesAtom);
  const [loadingId, setLoadingId] = useState(null);

  const handleDeleteRep = async (id) => {
    setLoadingId(id);
    try {
      await deleteRepresentative(id);
      setRepresentatives(currentReps.filter((rep) => rep.id !== id));
    } catch (error) {
      console.log(error);
    }
    setLoadingId(null);
  };

  useEffect(() => {
    const getReps = async () => {
      const representatives = await getRepresentatives();
      setRepresentatives(representatives);
    }
    getReps();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Cidade</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentReps.length > 0 && currentReps.map((rep) => (
          <TableRow key={rep.id}>
            <TableCell className="font-medium">{rep.name}</TableCell>
            <TableCell className='flex items-center justify-start gap-2 pt-[26px]'>
              <Image
                alt="United States"
                width={20}
                height={10}
                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${americaPrefixes[rep.phone.slice(0, 3)]}.svg`} />
              {formatPhoneNumber(rep.phone)}
            </TableCell>
            <TableCell>{rep.city}</TableCell>
            <TableCell>{rep.uf}</TableCell>
            <TableCell className="text-right">
              <Button
                onClick={() => handleDeleteRep(rep.id)}
                className="border-2 rounded-2xl border-red-600 text-red-700 hover:bg-red-600 hover:text-white"
              >
                {loadingId === rep.id ? (
                  <MoonLoader color="red" size={16} />
                ) : (
                  'Excluir Representante'
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RepresentativesTable;
