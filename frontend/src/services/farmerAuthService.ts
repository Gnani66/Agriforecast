import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/farmer",
});

export const signupFarmer = async (data: { name: string; phone: string; email: string; password: string; region: string; farmType: string }) => {
  const response = await API.post("/signup", data);
  return response.data;
};

export const loginFarmer = async (data: { email: string; password: string }) => {
  const response = await API.post("/login", data);
  return response.data;
};
