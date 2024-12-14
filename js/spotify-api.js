// Spotify API Yapılandırması
const CLIENT_ID = '0f56c9fa43054320864dad4a724a065b';
const CLIENT_SECRET = 'ae1351f687e3404bac606896feacd672';
const REDIRECT_URI = 'http://127.0.0.1:5500/'; // Kendi local sunucunuzun adresi

// Token alma fonksiyonu
async function getSpotifyToken() {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token;
}

// Popüler Türk Sanatçıları Çekme
async function fetchPopularArtists() {
    try {
        const token = await getSpotifyToken();

        const artistIds = [
            '64d1rUxfizSAOE9UbMnUZd',   // Örnek Sanatçı ID'leri
            '5PRW6j58xEEWL4DDVEITKT',
            '1CcZoULzFHa8Uhwo6OlQcp',
            '46zuW8tHxwahYn7VNMgYTa',
            '4cMwyqmHCwJjRZ3frIVHTr',
            '4XP7cGw4t8BqZ8Du5q3bHg'
        ];

        const response = await fetch(`https://api.spotify.com/v1/artists?ids=${artistIds.join(',')}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        const artistContainer = document.querySelector('#artists-container');

        // Önceki içeriği temizle
        artistContainer.innerHTML = '';

        data.artists.forEach(artist => {
            const artistCard = `
                <div class="col-lg-2 col-md-3 col-sm-4 col-6 mb-4">
                    <div class="card text-white">
                        <img src="${artist.images[0]?.url}" class="card-img-top" alt="${artist.name}">
                        <div class="card-body">
                            <h5 class="card-title">${artist.name}</h5>
                            <p class="card-text">Sanatçı</p>
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
        const response = await fetch('https://api.spotify.com/v1/browse/new-releases?offset=0&country=TR&limit=6', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        const albumContainer = document.querySelector('.container-fluid .row:last-of-type');

        // Önceki içeriği temizle
        albumContainer.innerHTML = '';

        data.albums.items.forEach(album => {
            const albumCard = `
                <div class="col-lg-2 col-md-3 col-sm-4 col-6 mb-4">
                    <div class="card  text-white">
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

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', () => {
    fetchPopularArtists();
    fetchPopularAlbums();
});