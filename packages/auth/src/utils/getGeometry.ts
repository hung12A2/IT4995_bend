import axios from 'axios';

export const geometry = async (k: string) => {
  const address = encodeURI(k);
  const data = await axios
    .get(
      `https://rsapi.goong.io/geocode?address=${address}&api_key=kjg7LLE2DwzMeoPbruW4ZfcsA8jAoM3sV9qb30wC`,
    )
    .then((res:any) => res.data)
    .catch((e:any) => console.log(e));

  return data;
};
