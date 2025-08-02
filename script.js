async function fetchData() {
  const input = document.getElementById('inputValue').value.trim();
  const output = document.getElementById('output');
  output.innerHTML = "⏳ Fetching data...";

  let url = '';

  // Check if it's a full API link
  if (input.startsWith("http")) {
    url = input;
  }
  // If it's a number, assume it's user ID and fetch all users to match (GitHub doesn't support direct ID fetch)
  else if (!isNaN(input)) {
    url = `https://api.github.com/users?since=${parseInt(input) - 1}&per_page=1`;
  }
  // Otherwise treat as GitHub username
  else {
    url = `https://api.github.com/users/${input}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("User not found or invalid input");
    const data = await res.json();

    // If array returned (for ID-based fetch), use first result
    const user = Array.isArray(data) ? data[0] : data;

    output.innerHTML = `
      <img src="${user.avatar_url}" alt="Avatar" />
      <h3>${user.name || user.login}</h3>
      <p><strong>Username:</strong> ${user.login}</p>
      <p><strong>User ID:</strong> ${user.id}</p>
      <p><strong>Location:</strong> ${user.location || "Not specified"}</p>
      <p><strong>Bio:</strong> ${user.bio || "No bio provided"}</p>
      <p><strong>Public Repos:</strong> ${user.public_repos}</p>
      <p><strong>Followers:</strong> ${user.followers}</p>
      <p><strong>Following:</strong> ${user.following}</p>
      <a href="${user.html_url}" target="_blank">🌐 View Profile on GitHub</a>
    `;
  } catch (error) {
    output.innerHTML = `<p style="color: red;">❌ ${error.message}</p>`;
  }
}
