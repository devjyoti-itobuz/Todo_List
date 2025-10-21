async function fetchWithAuth(url, options = {}, retry = false) {
  const accessToken = localStorage.getItem("access-token");

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
  // console.log("Sending token:", accessToken);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401 && !retry) {
      const resClone = res.clone();
      const resBody = await resClone.json();

      if (resBody.message === "jwt expired") {
        const refreshToken = localStorage.getItem("refresh-token");

        if (!refreshToken) {
          localStorage.removeItem("access-token");
          localStorage.removeItem("refresh-token");
          window.location.href = "/pages/login.html";
          return;
        }

        const refreshResponse = await fetch(
          "http://localhost:3000/auth/refresh-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "refresh-token": refreshToken,
            },
          }
        );

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();

          localStorage.setItem("access-token", refreshData.accessToken);
          localStorage.setItem("refresh-token", refreshData.refreshToken);

          return fetchWithAuth(url, options, true);
        } 
        else {
          localStorage.removeItem("access-token");
          localStorage.removeItem("refresh-token");
          window.location.reload();
        }
      }
    }

    console.log(res);
    return res;

  } catch (error) {
    console.error("fetchWithAuth error:", error);
    throw error;
  }
}

export default fetchWithAuth;
