import axios from 'axios';

export const geometry = async (k: string) => {
  const address = encodeURI(k);
  const data = await axios
    .get(
      `https://rsapi.goong.io/geocode?address=${address}&api_key=kjg7LLE2DwzMeoPbruW4ZfcsA8jAoM3sV9qb30wC`,
    )
    .then(res => res.data)
    .catch(e => console.log(e));

  return data;
};

export const getDistance = async (origin: string, destination: string) => {
  const data = await axios
    .get(
      `https://rsapi.goong.io/DistanceMatrix?origins=${origin}&destinations=${destination}&vehicle=car&api_key=kjg7LLE2DwzMeoPbruW4ZfcsA8jAoM3sV9qb30wC`,
    )
    .then(res => res.data)
    .catch(e => console.log(e));

  return data;
};
