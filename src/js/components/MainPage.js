
import {templates, select, classNames} from '../settings.js';
import utils from '../utils.js';

class MainPage {

  constructor(){
    const thisPage = this;
    thisPage.dotsGenerate();
    
    thisPage.getElement();


    thisPage.carousel();
  }
  getElement(){
    const thisPage = this;
    // Commentary elements
    thisPage.commentary = document.querySelectorAll(select.carousel.commentary);
    // Dot elements
    thisPage.dots = document.querySelectorAll(select.carousel.circles);
    thisPage.dotContainer = document.querySelector(select.carousel.dotContainer);
  }
  renderInMenu(dotsObj){
    const thisPage = this;

    const generatedHTML = templates.mainPage(dotsObj);
    thisPage.element = utils.createDOMFromHTML(generatedHTML);
    const menuContainer = document.querySelector(select.containerOf.mainPage);
    menuContainer.appendChild(thisPage.element);
  }
  
  carousel(){
    const thisPage = this;
    thisPage.index = 1;
    console.log(thisPage.dots);
    thisPage.commentary[0].classList.add(classNames.carousel.active);
    thisPage.dots[0].classList.add(classNames.carousel.dotActive);

    setInterval(() => {
      for(let comment of thisPage.commentary){
        comment.classList.remove(classNames.carousel.active);
      }

      for(let dot of thisPage.dots){
        dot.classList.remove(classNames.carousel.dotActive);
      }

      thisPage.commentary[thisPage.index].classList.add(classNames.carousel.active);
      thisPage.dots[thisPage.index].classList.add(classNames.carousel.dotActive);
      thisPage.index++;
      if(thisPage.index == thisPage.commentary.length){
        thisPage.index = 0;
      }
    }, 3000);
  }


  dotsGenerate(){
    const thisPage = this;

    const HtmlForDots = templates.mainPage();
    const createHtml = utils.createDOMFromHTML(HtmlForDots);
    const commentary = createHtml.querySelectorAll(select.carousel.commentary);

    const dotsObj = {
      dot: [],
    };

    for( let i = 0; i < commentary.length; i++){
      
      const dotNummer = i.toString();
      dotsObj.dot.push(dotNummer);
    }
    thisPage.renderInMenu(dotsObj);
  }

}

export default MainPage;