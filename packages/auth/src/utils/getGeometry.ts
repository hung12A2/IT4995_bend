import axios from 'axios';

export const geometry = async (k: string) => {
  const address = encodeURI(k);
  const data = await axios
    .get(
      `https://rsapi.goong.io/geocode?address=${address}&api_key=inXFXxBnv2LKqIc5NYwRmbqtMbLeUHdXWDLT32Ii`,
    )
    .then((res:any) => res.data)
    .catch((e:any) => console.log(e));

  return data;
};
