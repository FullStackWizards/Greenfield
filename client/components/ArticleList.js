// this houses all the articles after a mood exists
import React from 'react';
import { fetchComments, postComment } from '../dbModels/comments.js'
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import { fetchAllArticles, fetchAllSources, fetchVoice } from '../models/articles.js';
import UserControls from './UserControls.js';
import Watson from 'watson-developer-cloud'
import Sentiment from 'sentiment';
import * as Logo from '../models/sourceLogo.js'

export default class ArticleList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      articles: [],
      mood: 'good',
      showComments: false
    };
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  componentWillMount() {
    this.getSources()
  }
  getArticles(sources) {
    var i = 0;
    var articles = [];
    getFetchCall.call(this);  

    function getFetchCall() {
      fetchAllArticles(sources[i].id)
      .then((result) => {
        console.log("Result:", i, result)
        result.articles = result.articles
        .map((article) => {
          article.source = sources[i];
          var result = Sentiment(article.title);
          article.sentimentScore = result.score;
          article.sentimentComparative = result.comparative;
          return article;
        })
        articles = articles.concat(result.articles);
        
        if(i < sources.length - 1){
          i++;
          getFetchCall.call(this, sources[i])
        } else {
          articles = this.removeDuplicates(articles);
          this.setState({ articles: articles })
        }
      })
    }
  }
  removeDuplicates(array) {
    var uniqueArticles = [];
    // Holds titles of articles that have already been pushed into the uniqueArticles array
    var uniqueTitles = [];
    // searches for unique article titles and adds them to the uniqueArticles array which will be returned
    array.forEach(article => {
      if(uniqueTitles.indexOf(article.title) === -1){
        uniqueTitles.push(article.title);
        uniqueArticles.push(article);
      }
    })
    return uniqueArticles;
  }
  getSources() {
    fetchAllSources()
    .then(source => {
      let sources = [];
      source.forEach(source => {
        let sourcesToFilter = ['buzzfeed', 'redditrall', 'bbcsport', 'googlenews', 'hackernews', 'wiredde', 'theguardianuk']
        if(sourcesToFilter.indexOf(source.id) === -1) {
          sources.push(source);
        }
      })
      this.getArticles(sources)
    })
  }
  openComments(title) {
    console.log('opening comments')
    this.setState({articleTitle: title})
    fetchComments(title)
    .then(comments => {
      this.setState({comments: comments})
      this.setState({showComments: true});
      console.log('showing comments modal', this.state.showComments)
    })
  }
  updateComments(){
    let title = this.state.articleTitle;
    fetchComments(title)
    .then(comments => {
      this.setState({comments: comments})
    })
  }
  closeComments() {
    this.setState({showComments: false})
  }
  textToSpeech(words) {
    fetchVoice(words).then(something => {
      var audio = new Audio('textToSpeech.wav');
      audio.play();
    })
  }
  changeMood(mood) {
    this.setState({mood: mood})
  }

  renderArticles(articles) {
    // sorts articles by emotion score by what the current mood is.
    if(this.state.mood){
      var sortObject = {
        'good': [-1, 1],
        'bad': [1, -1]
      };
      articles.sort((a, b) => {
        if(a.sentimentScore > b.sentimentScore) return sortObject[this.state.mood][0];
        else if(b.sentimentScore > a.sentimentScore) return sortObject[this.state.mood][1];
        else return 0;
      })
    }

    // Returning article elements to be displayed
    return articles.map((article) => {
      return (
        <div key={this.state.articles.indexOf(article)} className="photo-box u-1 u-med-1-3 u-lrg-1-4">
          <div>
            <img className="article" src={article.urlToImage} />
            <aside className="photo-box-caption">
              <img className="source-image" src={Logo.findSourceLogo(article.source)} />
              <p onClick={this.textToSpeech.bind(null, article.description)}> { article.title } - <a href={article.url} target="_blank">Full article</a></p>
              <a href="javascript:void(0)" onClick={e => this.openComments(article.title)}>Comments!</a>
            </aside>
          </div>
        </div>
      )
    })
  }

  render() {
    // show all articles for the given time period (eg. today) filtered for the mood variable in the app component
    return (
      <div className="pure-g">
        <div className="splash-container article_header">
          <h1>Good News or Bad News</h1>
          <UserControls getArticles={this.getArticles.bind(this)} articles={this.state.articles} changeMood={this.changeMood.bind(this)}/>
        </div> 
        {this.state.showComments ? 
          <Comments onClose={this.closeComments.bind(this)} updateComments={this.updateComments.bind(this)} title={this.state.articleTitle} comments={this.state.comments}/>
          :
          null}
        <div className="content-wrapper" >
        {this.renderArticles(this.state.articles)}
        </div>
      </div>
    )
  }
}

class Comments extends React.Component {
  constructor() {
    super()
    this.state = {
     msg: '',
     username: ''
    }
  }
  submitComment(){
    let title = this.props.title;
    let username = this.state.username;
    let msg = this.state.msg;

    if (username && msg) {
      postComment(title, username, msg)
      .then(resp => {
        console.log('yay we added a comment... resp: ', resp)
        this.setState({
          username: '',
          msg: ''
        })
        this.props.updateComments()
      })  
    }
  }

  render() {

    return (
      <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className='comments'>
          <h2>{this.props.title}</h2>
          <h3>Comments:</h3>
          <div className='comment-msgs'>
          { this.props.comments
            .map(comment => {
              return (
                <div className='single_comment'>
                <p><div className='comment-username'>{comment.username}: </div>{comment.msg}</p>
                </div>
                )
            })
          }
          </div>
          <form name="newComment" onSubmit={e => {
            e.preventDefault();
            this.submitComment();
          }}>
          <div> <input className='new-comment' type='text' placeholder='name' name="username" onChange={e => this.setState({username: e.target.value})} value={this.state.username}/> </div>
          <div> <textarea className='new-comment' form='newComment' placeholder='Enter your comment here' name="msg" onChange={e => this.setState({msg: e.target.value})} value={this.state.msg}/> </div>
            <button type='submit'>Submit</button>
          </form>
        </ModalDialog>
      </ModalContainer>
      )
  }
}
