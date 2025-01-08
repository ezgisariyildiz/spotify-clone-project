// Spotify API Yapılandırması
const CLIENT_ID = 'CLIENT_ID';
const CLIENT_SECRET = 'CLIENT_SECRET';
const REDIRECT_URI = 'http://127.0.0.1:5500/'; // Kendi local sunucunuzun adresi

// Token alma fonksiyonu
async function getSpotifyToken() {
    try {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
            },
            body: 'grant_type=client_credentials'
        });

        if (!result.ok) {
            throw new Error(`Token alımı başarısız: ${result.status}`);
        }

        const data = await result.json();
        return data.access_token;
    } catch (error) {
        console.error('Token alımı sırasında hata oluştu:', error);
    }
}

// Popüler Türk Sanatçıları Çekme
async function fetchPopularArtists() {
    try {
        const token = await getSpotifyToken();
        const response = await fetch('https://api.spotify.com/v1/artists?ids=1dfeR4HaWDbWqFHLkxsg1d', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`API çağrısı başarısız oldu: ${response.status}`);
        }

        const data = await response.json();
        const artistContainer = document.querySelector('#artists-container');
        artistContainer.innerHTML = '';

        data.artists.forEach(artist => {
            const artistCard = `
                <div class="col-lg-2 col-md-3 col-sm-4 col-6 mb-4">
                    <div class="card text-white">
                        <img src="${artist.images[0]?.url}" class="card-img-top" alt="${artist.name}">
                        <div class="card-body">
                            <h5 class="card-title">${artist.name}</h5>
                        </div>
                    </div>
                </div>
            `;
            artistContainer.innerHTML += artistCard;
        });
    } catch (error) {
        console.error('Sanatçıları çekerken hata oluştu:', error);
    }
}    

// Popüler Albümleri Çekme
async function fetchPopularAlbums() {
    try {
        const token = await getSpotifyToken();
        const response = await fetch('https://api.spotify.com/v1/browse/new-releases?country=TR&limit=6', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`API çağrısı başarısız oldu: ${response.status}`);
        }

        const data = await response.json();
        const albumContainer = document.querySelector('#albums-container');
        albumContainer.innerHTML = '';

        if (!data.albums || !data.albums.items) {
            throw new Error('Beklenen formatta veri alınamadı.');
        }

        data.albums.items.forEach(album => {
            const albumCard = `
                <div class="col-lg-2 col-md-3 col-sm-4 col-6 mb-4">
                    <div class="card text-white">
                        <img src="${album.images[0].url}" class="card-img-top" alt="${album.name}">
                        <div class="card-body">
                            <h5 class="card-title">${album.name}</h5>
                            <p class="card-text">${album.artists[0].name}</p>
                        </div>
                    </div>
                </div>
            `;
            albumContainer.innerHTML += albumCard;
        });
    } catch (error) {
        console.error('Albümleri çekerken hata oluştu:', error);
    }
}

// Öne Çıkan Listeler Çekme
async function fetchFeaturedPlaylists() {
    try {
        const token = await getSpotifyToken();
        const response = await fetch('---', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`API çağrısı başarısız oldu: ${response.status}`);
        }

        const data = await response.json();
        const playlistContainer = document.querySelector('#playlists-container');
        playlistContainer.innerHTML = '';

        if (!data.playlists || !data.playlists.items) {
            throw new Error('Beklenen formatta veri alınamadı.');
        }

        data.playlists.items.forEach(playlist => {
            const playlistCard = `
                <div class="col-lg-2 col-md-3 col-sm-4 col-6 mb-4">
                    <div class="card text-white bg-dark">
                        <img src="${playlist.images[0].url}" class="card-img-top" alt="${playlist.name}">
                        <div class="card-body">
                            <h5 class="card-title">${playlist.name}</h5>
                            <p class="card-text">${playlist.description}</p>
                        </div>
                    </div>
                </div>
            `;
            playlistContainer.innerHTML += playlistCard;
        });
    } catch (error) {
        console.error('Çalma listelerini çekerken hata oluştu:', error);
    }
}

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', () => {
    fetchPopularArtists();
    fetchPopularAlbums();
    fetchFeaturedPlaylists();
});