
//API DI IMDb
const key = "k_i8fhtv7w";
const number = 5;

var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };


  //tramite questa funzione ottengo l'id del film
  function onJson(json, i){
    id_film = json.results[0].id;
    console.log("L'id del film è" + id_film);
    //debugger;
    //Una volta ottenuto l'id del film posso usare l'api che utilizza wikipedia per ottenere la descrizione del film
    fetch('https://imdb-api.com/en/API/Wikipedia/'+key+'/'+id_film, requestOptions)
    .then(onResponse).then(json => (onJson2(json, i)));
  }


  function onResponse(response){
    console.log('Risposta ricevuta');
    return response.json();
  }


  function onJson2(json, i){
    console.log('JSON ricevuto 2');
    const text = json.plotShort.plainText;

    //Aggiunge il testo alla pagina
    console.log(text);
    const p = document.createElement("p");
    p.textContent=text;
    const d = document.querySelector('div [data-id="'+i+'"]');
    d.appendChild(p);
  }

  

  //questa è la fetch iniziale che trova l'id tramite il titolo
 for(let i=1; i<6; i++){
     let dd = document.querySelector('div [data-number="'+i+'"]');
     console.log("il titolo è:");
     console.log(dd.dataset.title);
     fetch('https://imdb-api.com/en/API/SearchMovie/'+key+'/'+dd.dataset.title, requestOptions)
    .then(onResponse).then(j => {
        //debugger;
        onJson(j,i)});
     dd.nextSibling;
 }

 //API DI SPOTIFY

 function onJson3(json) {
  console.log('JSON ricevuto');
  console.log(json);
  const library = document.querySelector('#album-view');
  library.innerHTML = '';
  const results = json.albums.items;
  let num_results = results.length;
  if(num_results > 7)
    num_results = 7;
  for(let i=0; i<num_results; i++)
  {
    const album_data = results[i]
    const title = album_data.name;
    const selected_image = album_data.images[0].url;
    const album = document.createElement('div');
    album.classList.add('album');
    const img = document.createElement('img');
    img.src = selected_image;
    album.appendChild(img);
    library.appendChild(album);
  }
}

function onResponse2(response) {
  console.log('Risposta ricevuta');
  return response.json();
}

function search(event)
{
  event.preventDefault();
  const album_input = document.querySelector('#album');
  const album_value = encodeURIComponent(album_input.value);
  console.log('Eseguo ricerca: ' + album_value);
  fetch("https://api.spotify.com/v1/search?type=album&q=" + album_value,
    {
      headers:
      {
        'Authorization': 'Bearer ' + token
      }
    }
  ).then(onResponse2).then(onJson3);
}

function onTokenJson(json)
{
  console.log(json)
  token = json.access_token;
}

function onTokenResponse(response)
{
  return response.json();
}

// Credenziali OAuth
const client_id = '1f7e1c0e6dac4b0eab58d73215314cb5';
const client_secret = '84e48de3eefc43f7809cef0ec453ec9f';

let token;

fetch("https://accounts.spotify.com/api/token",
	{
   method: "post",
   body: 'grant_type=client_credentials',
   headers:
   {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
   }
  }
).then(onTokenResponse).then(onTokenJson);

const form = document.querySelector('form');
form.addEventListener('submit', search)