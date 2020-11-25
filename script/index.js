
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

  resizeBlock(block, status, w){
    const that = this;
    let i = w;
    let z = 0;
    
    if(status === "open"){
      
      requestAnimationFrame(reduceWidth);
      function reduceWidth(){
        i -= 20;
        block.style.width = `${i}px`;
        if(i <= 0){
          block.style.width = `0px`;
          return;
        }
        requestAnimationFrame(reduceWidth);
      }
    }
    if(status === "close"){
      
      requestAnimationFrame(increaseWidth);
      function increaseWidth(){
        z += 20;
        block.style.width = `${z}px`;
        if(z >= w){
          block.style.width = `${w}px`;
          return;
        }
        requestAnimationFrame(increaseWidth);
      }
    }

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

  getSizeBlock(block, status){
    this.view.resizeBlock(block, status);
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

    this.wrap.querySelectorAll(".block").forEach((elem) =>{
      elem.addEventListener("mouseenter", (event) =>{
        let e = event.target;
        let img = e.querySelector("div");
        let w = parseInt(getComputedStyle(img).width);
        console.log(e)
        //this.toUseBlock(img, "open", w);
  
        e.addEventListener("mouseleave", () =>{
          console.log(e)
          //this.toUseBlock(img, "close", w);
        })
      })
    })

    // this.wrap.querySelectorAll(".block").forEach((elem) =>{
    //   elem.addEventListener("mouseleave", (event) =>{
    //     let e = event.target;
    //     this.toUseBlock(e, "close");
    //   })
    // })
    
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

  toUseBlock(block, status, w){
    this.model.getSizeBlock(block, status, w);
  }
}

const wrap = document.querySelector("body");
const view = new View(wrap),
      model = new Model(view),
      contr = new Controller(wrap, model);


