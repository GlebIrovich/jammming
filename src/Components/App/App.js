import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'Any String',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(track){
    let idExists = this.state.playlistTracks.some(trackIn => trackIn.id === track.id);
    if (!idExists) {
      let newList = this.state.playlistTracks;
      newList.push(track);
      this.setState({playlistTracks: newList});
    }
  }
  removeTrack(track){
    let newList = this.state.playlistTracks.filter(trackIn => trackIn.id !== track.id);
    this.setState({playlistTracks: newList});
  }
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }
  savePlaylist(){
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(
      this.setState({
        searchResults: [],
        playlistName: '',
        playlistTracks: []
      })
    )
  }
  search(term) {
    Spotify.search(term).then(
      tracks => {
        this.setState({
          searchResults: tracks
        })
      }
    );
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch = {this.search}/>
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}/>
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove = {this.removeTrack}
              onNameChange = {this.updatePlaylistName}
              onSave = {this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
