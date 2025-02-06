import ButtonDialog from '@/components/ButtonDialog'
import RepresentativesTable from '@/components/RepresentativesTable'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getRepresentatives } from '@/lib/actions/representative.action'
import React from 'react'

const page = async () => {


  return (
    <section className='w-full flex items-start justify-center p-8'>
      <RepresentativesTable />
    </section>
  )
}

export default page