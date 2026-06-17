// crm-frontend-next\app\hooks\use-universities.ts
"use client";

import { useState } from "react";

import { University } from "@/types/university";

import { universitySeed } from "@/data/universities";

export function useUniversities() {
  const [universities, setUniversities] =
    useState<University[]>(universitySeed);

  const addUniversity = (
    university: University
  ) => {
    setUniversities((prev) => [
      university,
      ...prev,
    ]);
  };

  const updateUniversity = (
    id: string,
    data: University
  ) => {
    setUniversities((prev) =>
      prev.map((item) =>
        item.id === id ? data : item
      )
    );
  };

  const deleteUniversity = (id: string) => {
    setUniversities((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return {
    universities,
    addUniversity,
    updateUniversity,
    deleteUniversity,
  };
}