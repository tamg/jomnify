var searchBtn = document.querySelector('#search')
var resetBtn = document.querySelector('#reset')
var input = document.querySelector('input')
var result = document.querySelector('.result')

searchBtn.addEventListener('click', function(e){
  e.preventDefault()

  //clean and store each word in the search sentence
  if(input.value) {
    var terms = input.value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(' ')
  } else {
    return
  }

  if(terms && terms.length > 75){
    terms = terms.splice(0,75)
  }

  var promises = []

  //for each search term search spotify api and push to promise array
  terms.forEach(function(term) {
    term = 'track:' + term
    promises.push(search(term))
  })

  Promise.all(promises)
  .then(data => {
    reset()
    data.forEach(function(track) {
      var href = track.tracks.href
      var searchTerm = href.split('').slice(href.indexOf('3A')+2 , href.indexOf('&')).join('')
      var title = track.tracks.items["0"].name || ''
      var artist = track.tracks.items["0"].artists["0"].name || ''
      var link = track.tracks.items["0"].external_urls.spotify || ''

      displayTrack(searchTerm, title, artist, link)
    })
  })
  .catch(reason => {
    console.error(reason)
  })
})

function reset() {
  result.innerHTML = ''
}

function search(term) {
  var spotify = new SpotifyWebApi()
  return spotify.searchTracks(term, {limit: 1}) //returns a promise
}

function displayTrack(searchTerm, title,artist,link){
  var hilightedTitle = title.split(' ').map(word => {
    word = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
    if(word.toLowerCase() ===  searchTerm.toLowerCase()) {
      console.log(word);
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
}
