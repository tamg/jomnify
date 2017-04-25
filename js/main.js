var btn = document.querySelector('.btn')
var input = document.querySelector('input')
var result = document.querySelector('result')

btn.addEventListener('click', function(e){
  e.preventDefault()
  var terms = input.value.split(' ') //split full sentense

  //for each term search spotify api
  terms.forEach(term => search(term))
})

function search(queryTerm) {
  var spotify = new SpotifyWebApi();


  var prev = null
  // abort previous request, if any
  if (prev !== null) {
    prev.abort();
  }

  // store the current promise in case we need to abort it
  return spotify.searchTracks(queryTerm, {limit: 1})
    .then(function(data) {

      // clean the promise so it doesn't call abort
      prev = null;

      // var track =
      // result.innerHTML += data.tracks.items['0'].external_urls.spotify
      console.log(data.tracks.items['0'].external_urls.spotify);

    }, function(err) {
      console.error(err);
    });
}
