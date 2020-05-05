
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
    console.log(thisPage.commentary);
    thisPage.firstComment = document.querySelector(select.carousel.first);
    thisPage.secondComment = document.querySelector(select.carousel.second);
    thisPage.thirdComment = document.querySelector(select.carousel.third);
    // Dot elements
    thisPage.dots = document.querySelectorAll(select.carousel.circles);
    console.log(thisPage.dots);
    thisPage.dotOne = document.querySelector(select.carousel.dotOne);
    thisPage.dotTwo = document.querySelector(select.carousel.dotTwo);
    thisPage.dotThree = document.querySelector(select.carousel.dotThree);
    // Set first active class and basic index
    thisPage.dotOne.classList.add(classNames.carousel.dotActive);
    thisPage.firstComment.classList.add(classNames.carousel.active);
    
  }
  renderInMenu(){
    const thisPage = this;
    const generatedHTML = templates.mainPage();
    thisPage.element = utils.createDOMFromHTML(generatedHTML);
    const menuContainer = document.querySelector(select.containerOf.mainPage);
    menuContainer.appendChild(thisPage.element);
  }

  carousel(){
    const thisPage = this;
    thisPage.index = 0;

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