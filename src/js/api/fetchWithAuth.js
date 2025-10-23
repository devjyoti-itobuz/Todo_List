async function fetchWithAuth(url, options = {}, retry = false) {
  const accessToken = localStorage.getItem("access_token");

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401 && !retry) {
      const resClone = res.clone();
      const resBody = await resClone.json();

      if (resBody.message === "jwt expired") {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/pages/login.html";
          return;
        }

        const refreshResponse = await fetch(
          "http://localhost:3000/user/auth/refresh-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "refresh_token": refreshToken,
            },
          }
        );

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();

          localStorage.setItem("access_token", refreshData.accessToken);
          localStorage.setItem("refresh_token", refreshData.refreshToken);

          return fetchWithAuth(url, options, true);
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.reload();
        }
      }
    }

    // console.log(res);
    return res;
  } catch (error) {
    // console.error("fetchWithAuth error:", error);
    throw error;
  }
}

export default fetchWithAuth;
