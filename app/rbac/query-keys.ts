export const roleKeys = {
  all: ["roles"] as const,

  detail: (id: string) => ["roles", id] as const,

  modules: ["modules"] as const,
};
