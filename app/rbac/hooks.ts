"use client";

import { useQuery } from "@tanstack/react-query";

import { rbacApi } from "./api";
import { roleKeys } from "./query-keys";

export const useRoles = () =>
  useQuery({
    queryKey: roleKeys.all,

    queryFn: rbacApi.getRoles,
  });

export const useModules = () =>
  useQuery({
    queryKey: roleKeys.modules,

    queryFn: rbacApi.getModules,
  });
