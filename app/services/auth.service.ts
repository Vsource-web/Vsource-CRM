// crm-frontend-next\app\services\auth.service.ts
export const authService = {
  login: async (
    email: string,
    password: string
  ) => {
    const response =
      await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

    return await response.json();
  },

  logout: async () => {
    await fetch(
      "/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );
  },

  me: async () => {
    const response =
      await fetch(
        "/api/auth/me",
        {
          credentials: "include",
        }
      );

    if (!response.ok)
      return null;

    return await response.json();
  },
};
