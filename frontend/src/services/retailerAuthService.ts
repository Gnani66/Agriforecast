import axios from "axios";
import type { SignupFormData, LoginFormData } from "@/types";

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/retailer`,
});

export const signupRetailer = async (data: SignupFormData) => {
  const response = await API.post("/signup", data);
  return response.data;
};

export const loginRetailer = async (data: LoginFormData) => {
  const response = await API.post("/login", data);
  return response.data;
};
