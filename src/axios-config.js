import axios from "axios";

export const request = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER,
  headers: {
    "Content-Type": "application/json",
  },
});

export const requestPrivate = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER,
  headers: {
    "Content-Type": "application/json",
  },
  // credentials: "include",
  withCredentials: true,
});
