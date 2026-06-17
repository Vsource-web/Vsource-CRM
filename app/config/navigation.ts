// app/config/navigation.ts

import {
  Users,
  UserCog,
  ShieldCheck,
  Settings2,
  MapPin,
  LayoutDashboard,
  Building2,
  GraduationCap,
} from "lucide-react";

export const navigationItems = [
  {
    moduleCode: "DASHBOARD",
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    moduleCode: "MASTER_LEADS",
    to: "/leads",
    label: "MASTER Leads",
    icon: Users,
  },
  {
    moduleCode: "STUDENT_PROFILES",
    to: "/student-profiles",
    label: "Student Profiles",
    icon: GraduationCap,
  },
  {
    moduleCode: "MBBS_LEADS",
    to: "/mbbs-leads",
    label: "MBBS Leads",
    icon: Users,
  },
  {
    moduleCode: "UNIVERSITIES",
    to: "/universities",
    label: "Universities",
    icon: Building2,
  },
  {
    moduleCode: "MASTER_SETTINGS",
    to: "/master-settings",
    label: "Master Settings",
    icon: Settings2,
  },
  {
    moduleCode: "BRANCHES",
    to: "/branches",
    label: "Branches",
    icon: MapPin,
  },
  {
    moduleCode: "ROLES",
    to: "/roles",
    label: "Roles & Permissions",
    icon: ShieldCheck,
  },
  {
    moduleCode: "USERS",
    to: "/users",
    label: "User Management",
    icon: UserCog,
  },
] as const;
