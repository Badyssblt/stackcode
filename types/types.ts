// types.ts

export type User = {
  id: string;
  email: string;
  password?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  name?: string | null;
  emailVerified?: boolean | null;
  image?: string | null;
  projects?: ProjectUser[];
  accounts?: Account[];
  sessions?: Session[];
};

export type Project = {
  id: string;
  name: string;
  createdAt: Date;
  repoUrl?: string | null;
  users?: ProjectUser[];
  modules?: ProjectModule[];
};

export type Module = {
  id: string;
  name: string;
  description?: string | null;
  projects?: ProjectModule[];
};

export type ProjectModule = {
  id: string;
  projectId: string;
  moduleId: string;
  config?: Record<string, any> | null;
  createdAt: Date;
  project?: Project;
  module?: Module;
};

export type ProjectUser = {
  id: string;
  projectId: string;
  userId: string;
  role: "owner" | "admin" | "member";
  createdAt: Date;
  project?: Project;
  user?: User;
};

export type Account = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
  refresh_token_expires_in?: number | null;
  user?: User | null;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Session = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
};

export type VerificationToken = {
  identifier: string;
  token: string;
  expires: Date;
};

export type Dependency = {
  name: string;
  currentVersion: string;
  latestVersion: string;
  license: string | null;
  riskLevel: "low" | "medium" | "high" | "unknown";
};