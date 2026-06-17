import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../service/user.service";
import { userKeys } from "../service/query-keys";

export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: getUsers,
  });
};
