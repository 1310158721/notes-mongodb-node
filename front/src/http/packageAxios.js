import axios from 'axios';

// get 请求
export const httpGet = (url = '', params = {}, count = 3) => {
  count--;
  return new Promise((resolve) => {
    axios.get(url, { params }).then((res) => {
      resolve(res);
    }).catch((err) => {
      if (count > 0) {
        httpGet(url, params, count);
      } else {
        console.log(err);
      }
    });
  });
};

// post 请求
export const httpPost = (url = '', data = {}, count = 3) => {
  count--;
  return new Promise((resolve) => {
    axios.post(url, data).then((res) => {
      resolve(res);
    }).catch((err) => {
      if (count > 0) {
        httpPost(url, data, count);
      } else {
        console.log(err);
      }
    });
  });
};
