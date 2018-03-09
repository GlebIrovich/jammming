import './LoadingScreen.css';
import React from 'react';
import loading from './loading.gif';

const LoadingScreen = (props) => {
 let style={display: props.isLoading ? 'block' : 'none'}
  return (
    <div className='loading-screen' style={style}>
      <div className='container'>
        <img src={loading} alt="loading"  />
        <h1 className='message'>{props.isCompleted ? 'Done!': 'Operation failed =('}</h1>
      </div>
    </div>
  );
}

export default LoadingScreen;
