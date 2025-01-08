document.addEventListener("DOMContentLoaded", async () => {
    const artistsContainer = document.getElementById("artistsContainer");
    if (!artistsContainer) {
        console.error("Artists container not found in the DOM!");
        return;
    }

    async function fetchPopularArtists() {
        const artistsContainer = document.getElementById("artistsContainer");
        if (!artistsContainer) return;

        try {
            const token = await getAccessToken();
            const url = "https://api.spotify.com/v1/artists?ids=4NHQUGzhtTLFvgF5SZesLK,1uNFoZAHBGtllmzznpCI3s";
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("API çağrısı başarısız oldu");
            }

            const data = await response.json();
            artistsContainer.innerHTML = "";
            data.artists.forEach((artist) => {
                const artistDiv = document.createElement("div");
                artistDiv.className = "col-4";
                artistDiv.innerHTML = `
                    <div class="card">
                        <img src="${artist.images[0]?.url}" class="card-img-top" alt="${artist.name}">
                        <div class="card-body">
                            <h5 class="card-title">${artist.name}</h5>
                            <p class="card-text">Popülerlik: ${artist.popularity}</p>
                        </div>
                    </div>`;
                artistsContainer.appendChild(artistDiv);
            });
        } catch (error) {
            console.error(error);
        }
    }

    fetchPopularArtists();

    async function getAccessToken() {
        const clientId = 'clientId';
        const clientSecret = 'clientSecret';
        const url = "https://accounts.spotify.com/api/token";

        const body = new URLSearchParams();
        body.append("grant_type", "client_credentials");

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${btoa(clientId + ":" + clientSecret)}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: body
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.access_token; // Token'ı döndür
        } catch (error) {
            console.error("Error getting token:", error);
        }
    }

    async function displayArtists() {
        const token = await getAccessToken();
        if (!token) {
            console.error("Token could not be retrieved.");
            return;
        }

        const url = "https://api.spotify.com/v1/artists?ids=4NHQUGzhtTLFvgF5SZesLK,1uNFoZAHBGtllmzznpCI3s";

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (!data || !data.artists) {
                console.error("No artist data received!");
                return;
            }

            data.artists.forEach(artist => {
                const artistDiv = document.createElement("div");
                artistDiv.className = "col-4";
                artistDiv.innerHTML = `
                    <div class="card">
                        <img src="${artist.images[0]?.url}" class="card-img-top" alt="${artist.name}">
                        <div class="card-body">
                            <h5 class="card-title">${artist.name}</h5>
                            <p class="card-text">Popülerlik: ${artist.popularity}</p>
                        </div>
                    </div>
                `;
                artistsContainer.appendChild(artistDiv);
            });
        } catch (error) {
            console.error("Error fetching and displaying artists:", error);
        }
    }

    displayArtists();

    document.addEventListener("DOMContentLoaded", () => {
        const artistsContainer = document.getElementById("artistsContainer");
        if (!artistsContainer) {
            console.error("artistsContainer bulunamadı!");
            return;
        }
    });

});
