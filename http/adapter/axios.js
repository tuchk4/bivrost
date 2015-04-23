export default function AdapterAxios(axios) {
  return function(url, request) {
    return axios({
      url: url,
      method: request.verb,
      params: request.query,
      data: request.body,
      responseType: 'text',
      withCredentials: true
    });
  }
};
