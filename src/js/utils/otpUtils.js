export async function sendOTP(email) {
  try {
    const res = await fetch("http://localhost:3000/auth/sendOTP", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to send OTP");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function verifyOTP(email, otp) {
  try {
    const res = await fetch("http://localhost:3000/auth/verifyOTP", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || "OTP verification failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export function showOTPModal(email) {
  document.getElementById("verificationEmail").textContent = email;
  const modal = new bootstrap.Modal(
    document.getElementById("verifyEmailModal")
  );
  modal.show();
}

export function getOTPFromInputs() {
  return Array.from(document.querySelectorAll('[id^="otp"]'))
    .map((input) => input.value.trim())
    .join("");
}