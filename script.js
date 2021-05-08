console.log("hello world")
const movieName = document.querySelector("#movie-name");
const result = document.querySelector("#result");
const matchMovie = document.querySelector("#movie-list");
const nominationsList = document.querySelector("#Nominations-list");
const loading = document.querySelector("#loading");

var movieList = [];
//if data in localstorage exist data will be displayed
window.addEventListener("DOMContentLoaded", ()=>{
    movieList = getLocalStorage();
    nominationsList.innerHTML = nominatedMovies(movieList);
    removeNominatedMovie();
});

//when user start entering movie title result will be appeared
movieName.addEventListener('keyup', function(e) {
    var text = e.target.value;
    result.innerText = `"${text}"`;
    if(text){
        request(text).then((data)=>{
            matchMovie.innerHTML = findMovies(data)
            return data.Search;             
        }).then((data)=>{
            addNominateList(data);
        })
    }else{
        matchMovie.innerHTML = "";
        result.innerText = "";
    }   
});
//method to fetch data from OMBD
const request = async (name) => {
    loading.style.visibility = 'visible'
    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${name}&apikey=d165c351`);
        const json = await response.json();
        loading.style.visibility = 'hidden'
        return json;
    } catch (error) {
        loading.style.visibility = 'hidden'
        console.log(error)
    }   
}
//method to display find movies 
const findMovies = (data)=>{
    if(data.Search){
        const movies = data.Search
        .map(function (item) {
          return `
          <div class="card mb-4 mr-2" style="width: 10rem;">
          <img  style="height: 12rem;" src="${item.Poster}" class="card-img-top" alt="...">
          <div class="card-body text-center">
            <h5 class="card-title">${item.Title}</h5>
            <p> ${item.Year}</p>
            <button data-id="${item.imdbID}" class="add btn btn-secondary">Nominate</button>
          </div>
        </div>`
        }).join("");
      return movies;
    }else{
        return `
        <div class = "d-flex flex-row">
            <h4>${data.Error}</h4>
        </div>`
    }      
}
//method to add movie into nominations list  
const addNominateList = (data)=>{
    const add = document.querySelectorAll(".add");
    add.forEach((btn)=>{ 
        btn.addEventListener('click', (e)=>{
            var movieID = e.currentTarget.dataset.id;
            if(movieList.length === 5){
                window.alert("You already have 5 nominees")
            }else{
                e.currentTarget.parentNode.parentNode.classList.add('add-movie')
                var movie = data.find(item=> item.imdbID === movieID) 
                movieList.push({id: movie.imdbID ,name: movie.Title, year: movie.Year})
                nominationsList.innerHTML = nominatedMovies(movieList);
                removeNominatedMovie();
                addToLocalStorage(movieList);
                movieList.forEach((item)=>{
                    if(item.id === btn.dataset.id){
                        btn.disabled = true;
                        
                    }else{
                        btn.disabled = false;
                    }
                })          
            }
        })
    })  
}
//method to create movie element in nominations list
const nominatedMovies = (list)=>{
    const movies = list
      .map(function (item) {
        return `
        <div class = "d-flex flex-row" data-id = "${item.id}">
            <h4> <i class="bi bi-award"></i> ${item.name} (${item.year}) </h4>
            <button class="remove btn btn-light"><i class="bi bi-trash"></i></button>
        </div>`;
      }).join("");
    return movies;
}
//method to remove movie from nominations list
const removeNominatedMovie = ()=>{
    const removeMovie = document.querySelectorAll(".remove");
    removeMovie.forEach((btn)=>{
        btn.addEventListener('click', (e)=>{
            var movieID = e.currentTarget.parentNode.dataset.id;
            e.currentTarget.parentNode.classList.add('remove-movie')
            setTimeout(()=>{
                console.log(movieID)
                movieList = movieList.filter(item=>item.id != movieID)
                nominationsList.innerHTML = nominatedMovies(movieList);
                removeNominatedMovie();
                addToLocalStorage(movieList);
            },1500)
            
        })
    })
}
//method to save data in localstorage
const  addToLocalStorage = (data)=>{
    localStorage.setItem("list", JSON.stringify(data));
}
//method to retrive data from localstorage
const getLocalStorage=()=> {
    return localStorage.getItem("list")
      ? JSON.parse(localStorage.getItem("list"))
      : [];
}