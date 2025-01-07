// Sanatçı bilgilerini göstereceğimiz container
const artistsContainer = document.getElementById("artists-all-container");

// Spotify API URL'si (Örnek: Popüler sanatçılar)
const API_URL = "https://api.spotify.com/v1/browse/categories/popular-artists";

const TOKEN = "YOUR_TOKEN";

async function getAccessToken() {
    const clientId = '0f56c9fa43054320864dad4a724a065b';
    const clientSecret = 'ae1351f687e3404bac606896feacd672';
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

// API'den sanatçı bilgilerini çekme fonksiyonu
async function fetchArtists() {
    const token = await getAccessToken(); // Token'ı dinamik olarak al
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
        console.log(data); // Gelen verileri kontrol et
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// API çağrısını başlat
fetchArtists();

// Sanatçıları DOM'a ekleyen fonksiyon
async function displayArtists() {
    const token = await getAccessToken();
    const url = "https://api.spotify.com/v1/artists?ids=4NHQUGzhtTLFvgF5SZesLK,1uNFoZAHBGtllmzznpCI3s";

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        const artistsContainer = document.getElementById("artists-container");

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


