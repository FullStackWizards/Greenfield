import React from 'react';

// this component allows the user to control which articles are displayed via date selection
export default class UserControls extends React.Component {
  render() {
    return (
      <div className='user-controls'>
        <button className='goodNews' onClick={this.props.getArticles}>Good News</button>
        <button className='badNews' onClick={this.props.getArticles}>Bad News</button>
      </div>
    )
  }
}
