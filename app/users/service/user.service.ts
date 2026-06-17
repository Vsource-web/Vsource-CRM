import { api } from "@/lib/api";

export const getUsers = async () => {
  const { data } = await api.get("/user/getAll");

  return data;
};

export const getUserById = async (id: string) => {
  const { data } = await api.get(`/user/${id}`);

  return data;
};

export const createUser = async (payload: any) => {
  const { data } = await api.post("/user/add", payload);

  return data;
};

export const updateUser = async (id: string, payload: any) => {
  const { data } = await api.put(`/user/${id}`, payload);

  return data;
};

export const deleteUser = async (id: string) => {
  const { data } = await api.delete(`/user/${id}`);

  return data;
};
