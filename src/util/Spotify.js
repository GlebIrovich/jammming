
const clientId = process.env.REACT_APP_CLIENT_ID;

const redirectURI = process.env.REACT_APP_REDIRECT_URI;

let Spotify = {
  accessToken: '',
  getAccessToken(){
    if(!this.accessToken){
      let token = window.location.href.match(/access_token=([^&]*)/);
      let expires = window.location.href.match(/expires_in=([^&]*)/);

      if(token && expires){
        this.accessToken = token[1];
        const expiresIn = expires[1]
        window.setTimeout(() => this.accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
      } else {
        window.location.replace(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`);
      }
    }
    return this.accessToken;
  },
   search(term){
    const url = `https://api.spotify.com/v1/search?type=track&q=${term}`;

    return fetch(url, {
      headers: {
        Authorization: 'Bearer ' + this.getAccessToken()
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }});
        }
        return [];
      });
  },
  getUserId(url, headers){
    return fetch(url, {
      headers: headers
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.id) {
        return jsonResponse.id;
      };
    })
  },
  // Get playlist id
  async getPlaylistID(url, headers, playlistName){
    try{
      let response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({name: playlistName})
      })
      if(response.ok){
        let jsonResponse = await response.json();
        return jsonResponse.id;
      }
      throw new Error('Request failed!')
    } catch(error) {
      return false;
    }
  },
  // add tracks
  async addTracks(url, headers, trackURIs){
    try{
      let response = await fetch(url ,{
        method: 'POST',
        headers: headers,
        body: JSON.stringify({uris: trackURIs})
      })
      if(response.ok){
        let jsonResponse = await response.json();
        return jsonResponse;
      }
      throw new Error('Request failed!')
    } catch(error) {
      return false;
    }
  },
  async savePlaylist(playlistName, trackURIs){
    let isCompleted = false;
    if(trackURIs.length){
      const accessToken = this.getAccessToken();
      const headers = {'Authorization': 'Bearer ' + accessToken};
      const urlUserId = 'https://api.spotify.com/v1/me';

      const userId = await this.getUserId(urlUserId, headers);

      const url = `https://api.spotify.com/v1/users/${userId}/playlists`;

      // create a playlist
      const playlistID = await this.getPlaylistID(url, headers, playlistName);

      // move tracks to a created Playlist
      const addTracksUrl = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`;
      const tracksResponse = await this.addTracks(addTracksUrl, headers, trackURIs);

      isCompleted = tracksResponse ? true : false;
    }
    return isCompleted;
  }
}


export default Spotify;
