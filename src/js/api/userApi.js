import fetchWithAuth from "./fetchWithAuth.js";

export async function registerUser(email, password) {
  const res = await fetch("http://localhost:3000/user/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  return { ok: res.ok, data };
}

export async function loginUser(email, password) {
  const res = await fetch("http://localhost:3000/user/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

export async function resetUserPassword(currentPassword, newPassword) {
  const response = await fetchWithAuth(
    "http://localhost:3000/user/auth/reset-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    }
  );

  const data = await response.json();
  return { ok: response.ok, data };
}

export async function sendOtp(email) {
  const res = await fetch("http://localhost:3000/user/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to send OTP");
  }

  return data;
}

export async function verifyOtp(email, otp) {
  const res = await fetch("http://localhost:3000/user/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "OTP verification failed");
  }

  return data;
}

export async function sendForgotPasswordOtp(email) {
  const res = await fetch(
    "http://localhost:3000/user/auth/forgot-password/send-otp",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }
  );

  const data = await res.json();
  return { ok: res.ok, data };
}

export async function resetForgotPassword(email, otp, newPassword) {
  const res = await fetch(
    "http://localhost:3000/user/auth/forgot-password/reset",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    }
  );

  const data = await res.json();
  return { ok: res.ok, data };
}