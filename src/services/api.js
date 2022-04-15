import axios from "axios";
import { user } from "./stores";
const axiosAPI = axios.create({
    // @ts-ignore
  baseURL: "/",
  withCredentials: true,
});

const apiRequest = (method, url, request) => {
    const headers = {
        "Content-Type": "application/json",
    };
    //using the axios instance to perform the request that received from each http method
    return axiosAPI({
        method,
        url,
        data: request,
        headers
      }).then(res => {
        return Promise.resolve(res.data);
      })
      .catch(err => {
        return Promise.reject(err);
      });
};

// function to execute the http get request
const get = (url, request) => apiRequest("get",url,request);

// function to execute the http delete request
const deleteRequest = (url, request) =>  apiRequest("delete", url, request);

const post = (url, request) => apiRequest("post", url, request);

// function to execute the http put request
const put = (url, request) => apiRequest("put", url, request);

// function to execute the http path request
const patch = (url, request) =>  apiRequest("patch", url, request);

// expose your method to other services or actions
const API ={
    get,
    delete: deleteRequest,
    post,
    put,
    patch
};
export default API;

export const getSettings = async (guild_id) => {
  const gdata = await get(`/api/guilds/${guild_id}/settings`);
  const settings_data = await get("/static/settings.json");

  let data = {};
  for (const [k, v] of Object.entries(settings_data)) {
    data[k] = {};
    for (const [key, value] of Object.entries(v)) {
      data[k][key] = {
        value: gdata[k] && gdata[k][key] ? gdata[k][key] : value.default,
        ...value
      }
    }
  }
  console.log(data);
  return data;
}

export const getUser = async () => {
  return await API.get("/api/user");
}