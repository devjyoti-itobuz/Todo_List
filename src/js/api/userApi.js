import fetchWithAuth from "./fetchWithAuth.js";

const API_USER = "http://localhost:3000/user/auth";

export async function registerUser(email, password) {
  
  const res = await fetch(`${API_USER}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  return { ok: res.ok, data };
}

export async function loginUser(email, password) {
  
  const res = await fetch(`${API_USER}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

export async function resetUserPassword(currentPassword, newPassword) {
  
  const response = await fetchWithAuth(`${API_USER}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const data = await response.json();
  return { ok: response.ok, data };
}

export async function sendOtp(email) {
  
  const res = await fetch(`${API_USER}/send-otp`, {
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
  
  const res = await fetch(`${API_USER}/verify-otp`, {
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
  
  const res = await fetch(`${API_USER}/forgot-password/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  return { ok: res.ok, data };
}

export async function resetForgotPassword(email, otp, newPassword) {
  
  const res = await fetch(`${API_USER}/forgot-password/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, newPassword }),
  });

  const data = await res.json();
  return { ok: res.ok, data };
}

export async function getUserDetails() {
  
  const res = await fetchWithAuth(`${API_USER}/details`, {
    method: "GET",
  });
  return res.json();
}

export async function updateUserDetails(name, profileImage) {
  
  const res = await fetchWithAuth(`${API_USER}/update-details`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, profileImage }),
  });
  return res.json();
}