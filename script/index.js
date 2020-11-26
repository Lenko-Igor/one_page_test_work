
// --- view --- //
class View {
  constructor(wrap){
    this.wrap = wrap;
    this.btnUp = this.wrap.querySelector("#upBtn");
    this.init();
    this.map = null;
    //this.initMap();
  }

  init(){
    this.btnUp.style.display = "none";
  }

  initMap(){
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 53.88995673217126, lng: 27.57493120092399},
      zoom: 18
    });
    let marker = new google.maps.Marker({
      position: {lat: 53.88995673217126, lng: 27.57493120092399},
      map: map,
      title: 'Информационные услуги в области безопасности',
      icon: '../img/marker.svg',
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

  drawImgBlock(block, w){
    block.style.width = `${w}px`;
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

  closeImg(e, width){
    let block = e.querySelector("div"),
        w = width;
    
    requestAnimationFrame(getClosed.bind(this));
    function getClosed(){
      if(w > 0){
        w -= 20;
        this.view.drawImgBlock(block, w);
        requestAnimationFrame(getClosed.bind(this));
      }else{
        w = 0;
        this.view.drawImgBlock(block, w);
        return;
      }
    }
  }

  openImg(e, width){
    let block = e.querySelector("div"),
        w = 0;

    requestAnimationFrame(getOpened.bind(this));
    function getOpened(){
      if(w <= width){
        this.view.drawImgBlock(block, w);
        w += 20;
        requestAnimationFrame(getOpened.bind(this));
      }else{
        w = width;
        this.view.drawImgBlock(block, w);
        return;
      }
    }
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
    this.wrap.querySelector(".getUp").addEventListener("click", (event) => {
        this.toUp();
    })

    this.wrap.querySelector(".menubar").addEventListener("click", (event) => {
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
        
        this.closeBlock(e, width);
        e.addEventListener("mouseleave", () => {
          this.openBlock(e, width);
        })
      }
    },true)
 
    
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

  closeBlock(e, width){
    this.model.closeImg(e, width);
  }

  openBlock(e, width){
    this.model.openImg(e, width);
  }
}

const wrap = document.querySelector("body");
const view = new View(wrap),
      model = new Model(view),
      contr = new Controller(wrap, model);


