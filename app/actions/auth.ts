"use server";

import { redirect } from "next/navigation";

import { createSession, deleteSession } from "@/lib/auth/server";
import {
  sanitizeRedirectTarget,
  validateDemoCredentials,
} from "@/lib/auth/session";

export interface LoginActionState {
  email: string;
  message: string | null;
  fieldErrors: {
    email?: string;
    password?: string;
  };
}

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const rawEmail = String(formData.get("email") ?? "");
  const rawPassword = String(formData.get("password") ?? "");
  const redirectTarget =
    sanitizeRedirectTarget(String(formData.get("next") ?? "")) ?? "/";

  try {
    const validation = validateDemoCredentials(rawEmail, rawPassword);

    if (!validation.ok) {
      return {
        email: rawEmail.trim(),
        message: validation.message,
        fieldErrors: validation.errors,
      };
    }

    await createSession(validation.email);
  } catch {
    return {
      email: rawEmail.trim(),
      message: "Workspace access is not configured yet. Add AUTH_SECRET and try again.",
      fieldErrors: {},
    };
  }

  redirect(redirectTarget);
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
