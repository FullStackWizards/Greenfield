// methods for getting filtered data from the DB
import fetch from 'isomorphic-fetch';

export function fetchAllSources() {
  /*grab articles from db that are within a given date range*/
  return fetch('https://newsapi.org/v1/sources')
    .then(resp => resp.json().then(x => x.sources.map(source => source)))
}

export function fetchAllArticles(source) {
  return fetch(`https://newsapi.org/v1/articles/?source=${source}&apiKey=7ccff954c320409ca3f73bc45049b2d1`, { method: 'GET' })
      .then((resp) => {
        if(resp.status === 500)
          return {
            articles: []
          };
        else
          return resp.json();
      })
}

function validateText(description) {
  return typeof description === 'string' ?
        description.length > 1
          ? description
            : 'No description'
        : 'No description'
}

export function fetchVoice(article) {
	let obj = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      words: validateText(article.description),
      id: article.id
    })
  }

	return fetch('/textToSpeech', obj)
}
