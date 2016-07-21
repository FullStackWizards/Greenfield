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
      showComments: false,
      articles: []
    };
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  componentWillMount() {
    this.getSources()
  }
  getArticles(source) {
    fetchAllArticles(source.id).then((x)=> {
      x.articles = x.articles.map((article) => {
        article.source = x.source;
        var result = Sentiment(article.title);
        article.sentimentScore = result.score;
        article.sentimentComparative = result.comparative;
        return article;
      })
      this.setState({ articles: this.state.articles.concat(x.articles) })
    }) 
  }
  removeDuplicates(array) {
    array.filter(this.onlyUnique)
  }
  getSources() {
    fetchAllSources()
    .then(source => source.forEach(source => {
      if(source !== 'buzzfeed' && source !== 'redditrall') {
        this.getArticles(source)
      }
    }))
  }
  openComments(title) {
    this.setState({articleTitle: title})
    fetchComments(title)
    .then(comments => {
      this.setState({comments: comments})
      this.setState({showComments: true});
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
  // Check to see if article.source is in sources state. 
  //   if true: return sourceImg url
  //   if false: do nothing
  render() {
    // show all articles for the given time period (eg. today) filtered for the mood variable in the app component
    return (
      <div className='daily_articles'>
        <div className="article_header">
          <h1>Good News or Bad News</h1>
          <UserControls getArticles={this.getArticles.bind(this)} articles={this.state.articles}/>
        </div>

        {this.state.showComments ?
          <Comments onClose={this.closeComments.bind(this)} title={this.state.articleTitle} comments={this.state.comments}/>
          : null} 
        { this.state.articles
          .map((article) => {
            return (
              <div key={this.state.articles.indexOf(article)} className="col-sm-6 col-md-4">
                <div className='single_article'>
                  <img src={article.urlToImage} />
                  <h3> { article.title } - { article.publishedAt }</h3>
                  <div onClick={this.textToSpeech.bind(null, article.description)} className="article_p">
                    <img className="source-image" src={Logo.findSourceLogo(article.source)} />
                    <p> { article.description }<div className="text">Text to Speech</div> <a href={article.url} target="_blank">(Read more)</a></p>
                  </div>
                  <a href="javascript:void(0)" onClick={e => this.openComments(article.title)}>Comments!</a>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}

class Comments extends React.Component {
  constructor() {
    super()
  }
  submitComment(){
    let title = this.props.title;
    let username = this.state.username;
    let msg = this.state.msg;
    postComment(title, username, msg)
    .then(resp => {
      console.log('yay we added a comment... resp: ', resp)
    })
  }

  render() {

    return (
      <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className='comments'>
          <h2>{this.props.title}</h2>
          <h3>Comments:</h3>
          { this.props.comments
            .map(comment => {
              return (
                <div className='single_comment'>
                <p><div className='comment-username'>{comment.username}: </div>{comment.msg}</p>
                </div>
                )
            })
          }
          <form name="newComment" onSubmit={e => {
            e.preventDefault();
            this.submitComment()
          }}>

          <div> <input type='text' placeholder='name' name="username" onChange={e => this.setState({username: e.target.value})}/> </div>
          <div> <input type='text' className='comment-box' placeholder='Enter your comment here' name="msg" onChange={e => this.setState({msg: e.target.value})}/> </div>
            <button type='submit'>Submit</button>

          </form>
        </ModalDialog>
      </ModalContainer>
      )
  }
}

