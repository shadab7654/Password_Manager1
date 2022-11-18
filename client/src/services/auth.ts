import http from "../utils/http";

const baseURL = "/auth";

export function signup(params: {
  name: string;
  email: string;
  masterKeyHash: string;
  protectedSymmetricKey: string;
}) {
  return http.post(`${baseURL}/signup`, params);
}

export function login(params: {
  email: string;
  masterKeyHash: string;
}) {
  return http.post(`${baseURL}/login`, params);
}
