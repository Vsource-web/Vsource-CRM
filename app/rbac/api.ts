import { api } from "@/lib/api";

export const rbacApi = {
  getRoles: async () => {
    const { data } = await api.get("/roles/getAll");

    return data;
  },

  getModules: async () => {
    const { data } = await api.get("/modules/getAll");

    return data;
  },

  updatePermissions: async (roleId: string, payload: any) => {
    const { data } = await api.post(`/roles/${roleId}/permissions`, payload);

    return data;
  },
};
