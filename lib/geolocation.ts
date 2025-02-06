import axios from 'axios';
import { formatAddress } from "./utils";

export const getLocation = async (lat, lng) => {
  const result = await axios.get(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ptbr`
  );

  return {
    city: result.data.city,
    uf: result.data.principalSubdivision
  };
};

export const searchLocation = async (term) => {
  const result = await axios.get(
    `https://nominatim.openstreetmap.org/search?format=json&q=${term}`
  );

  if (result.data.length !== 0) {
    return result.data.map((l) => ({
      value: formatAddress(l.display_name),
      label: formatAddress(l.display_name),
      lat: l.lat,
      lng: l.lon,
    }));
  }

  return [];
};