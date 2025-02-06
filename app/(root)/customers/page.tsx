import CustomersTable from '@/components/CustomersTable'
import React from 'react'

const page = () => {
  return (
    <section className='w-full flex items-start justify-center p-8 h-full overflow-y-auto'>
      <CustomersTable />
    </section>
  )
}

export default page