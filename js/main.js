var submitBtn, resetBtn, input, result, share, shareUrl, queryUrl

window.onload = function(){
  submitBtn = document.querySelector('#submit')
  resetBtn = document.querySelector('#reset')
  input = document.querySelector('input')
  result = document.querySelector('.result')
  share = document.querySelector('.share')

  //listen to 'enter' on the input
  input.addEventListener('keypress', function (e) {
      var key = e.which || e.keyCode
      if (key === 13) { handleSubmit(e) }
  })

  //listen to click on submitBtn
  submitBtn.addEventListener('click', handleSubmit)

  //check for query string url
  queryUrl = window.location.search.replace('?q=','')
  if(queryUrl.length){
    decodedTerm = decodeURIComponent(queryUrl)
    parseTerm(decodedTerm.split(' '))
    shareUrl = window.location.href
  }

}

function handleSubmit(e) {
  e.preventDefault()
  //clean and store each word in the search sentence
  if(input.value) {
    shareUrl = 'https://tamg.github.io/jomnify/?q=' + encodeURIComponent(input.value)
    var terms = input.value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(' ')
    if(terms && terms.length > 100){
      terms = terms.splice(0,100)
    }
  } else {
    return
  }
  result.innerHTML = '<p> Loading...'
  parseTerm(terms)
}

function parseTerm(terms){
  var promises = []
  //for each search term search spotify api and push to promise array
  terms.forEach(function(term) {
    term = 'track:' + term
    promises.push(search(term))
  })
  fulfillPromise(promises)
}

function search(term) {
  var spotify = new SpotifyWebApi()
  return spotify.searchTracks(term, {limit: 1}) //returns a promise
}

function fulfillPromise(promises){
  Promise.all(promises)
  .then(data => {
    reset() // clear result div before displaying new result
    data.forEach(function(track) {
      if(track.tracks.items["0"]) { // if the track exists
        var href = track.tracks.href
        var searchTerm = href.split('').slice(href.indexOf('3A')+2 , href.indexOf('&')).join('')
        var title = track.tracks.items["0"].name || ''
        var artist = track.tracks.items["0"].artists["0"].name || ''
        var link = track.tracks.items["0"].external_urls.spotify || ''

        displayTrack(searchTerm, title, artist, link)
      }
    })
  })
  .catch(reason => {
    console.error(reason)
  })
}

function displayTrack(searchTerm, title,artist,link){
  var hilightedTitle = title.split(' ').map(word => {
    word = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
    if(word.toLowerCase() ===  searchTerm.toLowerCase()) {
      return `<span class="searchTerm">${word}</span>`
    } else {
      return word
    }
  }).join(' ')

  var html = `
    <li>
      <a class="track" href="${link}" target="_blank">${hilightedTitle}</a> <span class="artist"> by ${artist} </span>
    </li>
  `
  result.innerHTML += html

  //insert shareUrl in the shareLink
  var shareLink = `
  <p> Share this playlist with friends! <a href='${shareUrl}' target='_blank'> Secret Spotify Playlist Message </a> </p>
  `
  share.innerHTML = shareLink
}

function reset(){
  result.innerHTML = ''
}
