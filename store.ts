import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const customerAtom = atom([]);
export const equipmentAtom = atom([]);
export const markersAtom = atomWithStorage('markers', []);
export const locationSelectedAtom = atom({
  lat: null,
  lng: null,
  city: null,
  uf: null,
  country: null,
});
export const customersAtom = atom([]);
export const updateCustomerAtom = atom({
  updateModalOpen: false,
  customer: {} as any,
})
export const representativesAtom = atom([]);
export const equipmentsForChart = atom([]);
export const filterAtom = atom({
  range: '',
  area: 'Nacional',
  supervisor: 'Todos',
});

export const goalAtom = atomWithStorage('goal', {
  goal: "",
  year: "",
  current: "",
})

export const userLoggedAtom = atomWithStorage('userLogged', {
  name: "",
  email: "",
  role: "",
  companyName: "",
});
