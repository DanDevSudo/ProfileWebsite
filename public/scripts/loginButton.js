document.getElementById("loginbtn").addEventListener("click", async () => {
  const password = document.getElementById("login_password1").value.trim();
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });

  if (res.ok) {
    window.location.href = "./sites/home.html";
  } else {
    alert("Wrong password");
  }
});
