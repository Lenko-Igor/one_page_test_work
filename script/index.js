// --- view --- //
class View {
  constructor(wrap){
    this.wrap = wrap;
    this.btnUp = this.wrap.querySelector("#upBtn");
    this.init();
  }

  init(){
    this.btnUp.style.display = "none";
    
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

  scroll(y){
    window.scrollTo(0,y);
  }

  closedBtn(){
    this.btnUp.style.display = "none";
  }

  opendBtn(){
    this.btnUp.style.display = "block";
  }

  getVisualMenuBar(){
    let i = 0,
        m = null,
        navBar = this.wrap.querySelector(".navBar"),
        opn = this.wrap.querySelector("#opn"),
        cls = this.wrap.querySelector("#cls"),
        computedStyle = getComputedStyle(navBar);

    if(+computedStyle.opacity === 0){
      navBar.style.display = "block";
      opn.style.display = "none";
      cls.style.display = "block";
      requestAnimationFrame(toOpen)
      
      function toOpen(){
        if(i < 1){
          i += 0.05;
          navBar.style.opacity = `${i}`;
          m = requestAnimationFrame(toOpen);
        }else{
          cancelAnimationFrame(m);
          i = 0;
        }
      }
    }
    
    if(+computedStyle.opacity > 0){
      i = 1;
      requestAnimationFrame(toClose);
      opn.style.display = "block";
      cls.style.display = "none";
      
      function toClose(){
        if(i >= 0){
          i -= 0.05;
          navBar.style.opacity = `${i}`;
          m = requestAnimationFrame(toClose);
        }else{
          cancelAnimationFrame(m);
          navBar.style.display = "none";
          i = 0;
        }
      }
    }
  }

  drawImgBlockW(block, w){
    block.style.width = `${w}px`;
  }

  drawImgBlockH(block, h){
    block.style.height = `${h}px`;
  }
  
  getBlockContent(block, elem){
    const b = elem.parentElement.querySelectorAll(".plus");
    
    b.forEach((e) => {
      e.classList.toggle("closed");
    })
    block.classList.toggle("closed");
   }
}

// --- model --- //
class Model {
  constructor(view){
    this.view = view;
  }

  toUpPage(){
    let move = requestAnimationFrame(moveUp.bind(this));
    let y = window.pageYOffset;
    
    function moveUp(){
      if(y > 0){
        y -= 100;
        this.view.scroll(y);
        move = requestAnimationFrame(moveUp.bind(this));
      }else{
        this.view.scroll(0);
        cancelAnimationFrame(move)
      }
    }
  }

  toCloseBtn(){
    this.view.closedBtn();
  }

  toOpenBtn(){
    this.view.opendBtn();
  }

  moveMenuBar(){
    this.view.getVisualMenuBar();
  }

  closeImg(e, width, height){
    let block = e.querySelector("div"),
        w = width,
        h = height,
        step = 10,
        hBlock = parseInt(getComputedStyle(e).height);

    if(h < hBlock){
      requestAnimationFrame(getClosed.bind(this));
      function getClosed(){
        if(h > 0){
          h -= step;
          this.view.drawImgBlockH(block, h);
          requestAnimationFrame(getClosed.bind(this));
        }else{
          h = 0;
          this.view.drawImgBlockH(block, h);
          return;
        }
      }
    }else{
      requestAnimationFrame(getClosed.bind(this));
      function getClosed(){
        if(w > 0){
          w -= step;
          this.view.drawImgBlockW(block, w);
          requestAnimationFrame(getClosed.bind(this));
        }else{
          w = 0;
          this.view.drawImgBlockW(block, w);
          return;
        }
      }
    }

  }

  openImg(e, width, height){
    let block = e.querySelector("div"),
        w = 0,
        h = parseInt(getComputedStyle(block).height),
        step = 10,
        blockH = parseInt(getComputedStyle(block).height);

    if(blockH < height){
      requestAnimationFrame(getOpened.bind(this));
      function getOpened(){
        if(h < height){
          this.view.drawImgBlockH(block, h);
          h += step;
          requestAnimationFrame(getOpened.bind(this));
        }else{
          h = height;
          this.view.drawImgBlockH(block, h);
          return;
        }
      }
    }else{
      requestAnimationFrame(getOpened.bind(this));
      function getOpened(){
        if(w <= width){
          this.view.drawImgBlockW(block, w);
          w += step;
          requestAnimationFrame(getOpened.bind(this));
        }else{
          w = width;
          this.view.drawImgBlockW(block, w);
          return;
        }
      }
    }
  }

  getMoveContent(block, elem){
    this.view.getBlockContent(block, elem);
  }
}

// --- controller --- //
class Controller {
  constructor(wrap, model){
    this.wrap = wrap;
    this.model = model;
    this.init();
  }

  init(){
    this.wrap.querySelector(".getUp").addEventListener("click", () => {
        this.toUp();
    })

    this.wrap.querySelector(".menubar").addEventListener("click", () => {
      this.toUseMenuBar();
    })

    window.addEventListener("scroll", () =>{
      if(window.pageYOffset > 1000 ){
        this.toOpen();
      }else{
        this.toClose();
      } 
    })

    this.wrap.querySelector("#blocks").addEventListener("mouseenter", (event) => {
      let e = event.target;
      
      if(e.className === "block"){
        let width = parseInt(getComputedStyle(e.querySelector("div")).width);
        let height = parseInt(getComputedStyle(e.querySelector("div")).height);
        
        this.closeBlock(e, width, height);
        e.addEventListener("mouseleave", () => {
          this.openBlock(e, width, height);
        })
      }
    },true)

    this.wrap.querySelector(".advantage").querySelectorAll(".plus").forEach((elem) => {
      elem.addEventListener("click", () => {
        let block = elem.parentElement.lastElementChild;
        this.usePlus(block, elem);
      })
    })
  }

  toUp(){
    this.model.toUpPage();
  }

  toClose(){
    this.model.toCloseBtn();
  }

  toOpen(){
    this.model.toOpenBtn();
  }

  toUseMenuBar(){
    this.model.moveMenuBar();
  }

  closeBlock(e, width, height){
    this.model.closeImg(e, width, height);
  }

  openBlock(e, width, height){
    this.model.openImg(e, width, height);
  }

  usePlus(block, elem){
    this.model.getMoveContent(block, elem);
  }
}

const wrap = document.querySelector("body");
const view = new View(wrap),
      model = new Model(view),
      contr = new Controller(wrap, model);


