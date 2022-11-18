import http from "../utils/http";

const baseURL = "/vault";

export function get() {
  return http.get(`${baseURL}`);
}

export function update(params: { vault: string }) {
  return http.post(`${baseURL}`, params);
}
