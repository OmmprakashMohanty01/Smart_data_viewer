function fetchData() {
  const mode = document.getElementById("mode").value;
  const input = document.getElementById("inputValue").value.trim();
  const resultDiv = document.getElementById("result");

  let url = "";

  if (mode === "url") {
    if (!input.startsWith("http")) {
      resultDiv.innerHTML = "❌ Please enter a valid URL.";
      return;
    }
    url = input;
  } else if (mode === "github") {
    if (input === "") {
      resultDiv.innerHTML = "❌ Enter a GitHub username.";
      return;
    }
    url = `https://api.github.com/users/${input}`;
  } else if (mode === "jsonplaceholder") {
    if (isNaN(input) || input === "") {
      resultDiv.innerHTML = "❌ Enter a valid numeric ID.";
      return;
    }
    url = `https://jsonplaceholder.typicode.com/users/${input}`;
  }

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("🔴 Data not found.");
      return response.json();
    })
    .then(data => {
      renderCard(data, mode);
    })
    .catch(error => {
      resultDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
}

function renderCard(data, mode) {
  const resultDiv = document.getElementById("result");

  if (mode === "github") {
    resultDiv.innerHTML = `
      <div class="card">
        <img class="avatar" src="${data.avatar_url}" alt="Avatar" />
        <h2>${data.name || data.login}</h2>
        <p><strong>Username:</strong> ${data.login}</p>
        <p><strong>Location:</strong> ${data.location || 'N/A'}</p>
        <p><strong>Public Repos:</strong> ${data.public_repos}</p>
        <p><strong>Followers:</strong> ${data.followers}</p>
        <p><a href="${data.html_url}" target="_blank">🔗 View GitHub Profile</a></p>
      </div>
    `;
  } else if (mode === "jsonplaceholder") {
    resultDiv.innerHTML = `
      <div class="card">
        <h2>${data.name}</h2>
        <p><strong>Username:</strong> ${data.username}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Company:</strong> ${data.company?.name}</p>
        <p><strong>City:</strong> ${data.address?.city}</p>
        <p><a href="https://${data.website}" target="_blank">🔗 Visit Website</a></p>
      </div>
    `;
  } else {
    // Generic JSON viewer for raw API data
    resultDiv.innerHTML = `
      <div class="card">
        <h2>Raw JSON Data</h2>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </div>
    `;
  }
}
