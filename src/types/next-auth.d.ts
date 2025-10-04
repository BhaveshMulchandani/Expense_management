import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "employee" | "manager" | "admin";
      companyId: string;
      managerId?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: "employee" | "manager" | "admin";
    companyId: string;
    managerId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "employee" | "manager" | "admin";
    companyId: string;
    managerId?: string | null;
  }
}
