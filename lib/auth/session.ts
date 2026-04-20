import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "bwi_demo_session";
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export interface DemoSession {
  email: string;
  expiresAt: number;
}

export interface DemoCredentialErrors {
  email?: string;
  password?: string;
}

interface DemoCredentialSuccess {
  ok: true;
  email: string;
}

interface DemoCredentialFailure {
  ok: false;
  errors: DemoCredentialErrors;
  message: string;
}

export type DemoCredentialValidationResult =
  | DemoCredentialSuccess
  | DemoCredentialFailure;

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET?.trim();

  if (secret) {
    return secret;
  }

  const fallbackSeed = [
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    process.env.VERCEL_GIT_COMMIT_SHA,
    process.env.VERCEL_GIT_REPO_SLUG,
    "bridgewater-demo-auth",
  ]
    .filter(Boolean)
    .join("|");

  return createHash("sha256").update(fallbackSeed).digest("hex");
}

function signPayload(payload: string) {
  return createHmac("sha256", getAuthSecret()).update(payload).digest("base64url");
}

export function sanitizeRedirectTarget(value?: string | null) {
  if (!value) {
    return null;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
}

export function validateDemoCredentials(
  emailInput: string,
  passwordInput: string,
): DemoCredentialValidationResult {
  const email = emailInput.trim().toLowerCase();
  const password = passwordInput.trim();
  const errors: DemoCredentialErrors = {};

  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (errors.email || errors.password) {
    return {
      ok: false,
      errors,
      message: "Use any valid email and a password with at least 6 characters.",
    };
  }

  return {
    ok: true,
    email,
  };
}

export function createSessionToken(session: DemoSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = signPayload(payload);

  return `${payload}.${signature}`;
}

export function readSessionFromToken(token?: string | null) {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8"),
    ) as Partial<DemoSession>;

    if (
      typeof parsed.email !== "string" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }

    if (parsed.expiresAt <= Date.now()) {
      return null;
    }

    return {
      email: parsed.email,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}
