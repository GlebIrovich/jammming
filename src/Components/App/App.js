import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New playlist',
      playlistTracks: [],
      isCompleted: false,
      isLoading: false
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.loading = this.loading.bind(this);
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
  loading(loadingStatus, delay){
    setTimeout(function(){
      this.setState({
        isLoading: !loadingStatus
      })
    }.bind(this), delay)
  }
  savePlaylist(){
    // start loading screen
    this.loading(this.state.isLoading, 0);
    let trackURIs = this.state.playlistTracks.map(track => track.uri);

    Spotify.savePlaylist(this.state.playlistName, trackURIs).then( isCompleted => {
      this.setState({
        isCompleted: isCompleted
      });
      if (isCompleted){
        this.setState({
          playlistName: 'New playlist',
          playlistTracks: []
        })
      }
      this.loading(this.state.isLoading, 4000);
    }
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
          <LoadingScreen
            isLoading={this.state.isLoading}
            isCompleted={this.state.isCompleted}/>
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
