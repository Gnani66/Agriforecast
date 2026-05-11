import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/distributor`,
});

interface SignupData {
  name: string;
  email: string;
  password: string;
  companyName: string;
  fleetSize: number;
  warehouseLocation: string;
  serviceRegion: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const signupDistributor = async (data: SignupData) => {
  const response = await API.post("/signup", data);
  return response.data;
};

export const loginDistributor = async (data: LoginData) => {
  const response = await API.post("/login", data);
  return response.data;
};
