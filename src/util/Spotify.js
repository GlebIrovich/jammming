require('dotenv').config();
const clientId = process.env.REACT_APP_CLIENT_ID;
//const redirectURI = 'http://localhost:3000/';
const redirectURI = 'https://codeacademy-jammming.herokuapp.com/';
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
  getUserId(){
    const accessToken = this.getAccessToken();
    const headers = {'Authorization': 'Bearer ' + accessToken};
    const url = 'https://api.spotify.com/v1/me';
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
  async savePlaylist(playlistName, trackURIs){
    if(trackURIs){
      const accessToken = this.getAccessToken();
      const headers = {'Authorization': 'Bearer ' + accessToken};
      let userId = await this.getUserId();
      const url = `https://api.spotify.com/v1/users/${userId}/playlists`;

      // create a playlist
      const playlistID = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({name: playlistName})
      }).then(response => {
        if(response.ok){
          return response.json();
        }
      }).then(jsonResponse => jsonResponse.id)

      // move tracks to a created Playlist
      const addTracksUrl = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`
      fetch(addTracksUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({uris: trackURIs})
      }).then(response => {
        if(response.ok){
          return response.json();
        }
      }).then(jsonResponse => jsonResponse)
    }
    return ;
  }
}


export default Spotify;
