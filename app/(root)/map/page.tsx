import CustomerMap from '@/components/CustomerMap'
import GeolocationSelect from '@/components/GeolocationSelect';
import { Button } from '@/components/ui/button';
import { createCustomer, getCustomers } from '@/lib/actions/customer.action';
import { getRepresentatives } from '@/lib/actions/representative.action';
import { getSupervisors } from '@/lib/actions/supervisor.action';
import { cookies } from 'next/headers';
import React, { useEffect, useState } from 'react'

const Map = async () => {
  const _cookies = cookies();
  const userId = _cookies.get("appwrite-user-id")?.value;
  const customers = await getCustomers(userId);
  const representatives = await getRepresentatives();
  const supervisors = await getSupervisors();

  return (
    <section className="w-full flex flex-col items-center justify-center p-2">
      <div className="w-full flex items-start">

      </div>
      <CustomerMap customers={customers} representatives={representatives} supervisors={supervisors} />
    </section>
  )
}

export default Map