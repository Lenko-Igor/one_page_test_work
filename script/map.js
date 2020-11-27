export function map(){
  ymaps.ready(function () {
    var myMap = new ymaps.Map("YMapsID", {
      center: [53.891853, 27.570859],
      zoom: 18
    },
    {
      searchControlProvider: "yandex#search",
    }
    );
    var myPlacemark = new ymaps.Placemark(
      myMap.getCenter(),
      {
        iconLayout: 'default#image',
        iconImageHref: "../img/marker.png",
        iconImageSize: [75, 102],
      }
    );
    myMap.geoObjects.add(myPlacemark); 
  });
}