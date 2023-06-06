import axios from 'axios';

export const getMultipleFetcher = (...urls: string[]) => {
    const getRequest = (url: string) => axios.get(url).then((res) => res.data);
    return Promise.all(urls.map((url) => getRequest(url)));
};

export default getMultipleFetcher;
