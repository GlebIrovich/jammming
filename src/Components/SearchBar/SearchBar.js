import React from 'react';
import './SearchBar.css';


class SearchBar extends React.Component {
  constructor(props){
    super(props);
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }
  // check this "state of the term"
  search() {
    this.props.onSearch(this.state.searchTerm);
  }
  handleTermChange(event) {
    this.setState({searchTerm: event.target.value})
  }
  render() {
    return (
      <div className="SearchBar">
        <input onChange={this.handleTermChange} placeholder="Enter A Song Title" />
        <a onClick={this.search}>SEARCH</a>
      </div>
    )
  }
}

export default SearchBar;
