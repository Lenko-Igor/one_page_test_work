// прокрутка сайта
const up = document.querySelector("#upBtn");
let map = null;
up.style.display = "none";

window.addEventListener("scroll", () =>{
  if(window.pageYOffset > 1000 ){
    up.style.display = "block";
  }else{
    up.style.display = "none";
  } 
})

up.addEventListener("click", () =>{
  let move = requestAnimationFrame(moveUp);
  let y = window.pageYOffset;
  
  function moveUp(){
    if(y > 0){
      y -= 100;
      window.scrollTo(0,y);
      move = requestAnimationFrame(moveUp);
    }else{
      window.scrollTo(0,0);
      cancelAnimationFrame(move)
    }
  }
})

// карта на сайте

function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 53.88995673217126, lng: 27.57493120092399},
    zoom: 18
  });
  let marker = new google.maps.Marker({
    position: {lat: 53.88995673217126, lng: 27.57493120092399},
    map: map,
    title: 'Информационные услуги в области безопасности',
    icon: '../img/svg.svg',
  });
}


