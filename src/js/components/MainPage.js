
import {templates, select, classNames} from '../settings.js';
import utils from '../utils.js';

class MainPage {

  constructor(){
    const thisPage = this;

    thisPage.renderInMenu();
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
  renderInMenu(){

    const thisPage = this;
    
    const dotAmountElement = document.querySelector(select.carousel.dotAmount);

    const dotsAmount = parseInt(dotAmountElement.getAttribute('id'));
    console.log(dotsAmount);
    thisPage.dotsy = {
      dot: [],
    };

    for( let i = 0; i < dotsAmount; i++){
      console.log(thisPage.dotsy.dot);
      const dotNummer = i.toString();
      thisPage.dotsy.dot.push(dotNummer);
    }
    

    const generatedHTML = templates.mainPage(thisPage.dotsy);
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
}

export default MainPage;