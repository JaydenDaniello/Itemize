export type RegisterInput = {
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

async function parseJsonSafely(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function registerUser(data: RegisterInput) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const body = await parseJsonSafely(res);

  if (!res.ok) {
    throw new Error(body?.error || "Registration failed");
  }

  return body;
}

export async function loginUser(data: LoginInput) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const body = await parseJsonSafely(res);

  if (!res.ok) {
    throw new Error(body?.error || "Login failed");
  }

  return body;
}