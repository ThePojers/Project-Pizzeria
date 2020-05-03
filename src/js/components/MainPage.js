
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
    thisPage.firstComment = document.querySelector(select.carousel.first);
    thisPage.secondComment = document.querySelector(select.carousel.second);
    thisPage.thirdComment = document.querySelector(select.carousel.third);
    // Dot elements
    thisPage.dotOne = document.querySelector(select.carousel.dotOne);
    thisPage.dotTwo = document.querySelector(select.carousel.dotTwo);
    thisPage.dotThree = document.querySelector(select.carousel.dotThree);
    // Set first active class and basic index
    thisPage.dotOne.classList.add(classNames.carousel.dotActive);
    thisPage.firstComment.classList.add(classNames.carousel.active);
    thisPage.index = 0;
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

    if(thisPage.index == 0){
      setTimeout(function(){
        thisPage.firstComment.classList.remove(classNames.carousel.active);
        thisPage.dotOne.classList.remove(classNames.carousel.dotActive);
        thisPage.index = 1;
        thisPage.secondComment.classList.add(classNames.carousel.active);
        thisPage.dotTwo.classList.add(classNames.carousel.dotActive);
        thisPage.carousel();
      }, 4000);
    } else if (thisPage.index == 1){
      setTimeout(function(){
        thisPage.secondComment.classList.remove(classNames.carousel.active);
        thisPage.dotTwo.classList.remove(classNames.carousel.dotActive);
        thisPage.index = 2;
        thisPage.thirdComment.classList.add(classNames.carousel.active);
        thisPage.dotThree.classList.add(classNames.carousel.dotActive);
        thisPage.carousel();
      }, 4000);
    } else if (thisPage.index == 2){
      setTimeout(function(){
        thisPage.thirdComment.classList.remove(classNames.carousel.active);
        thisPage.dotThree.classList.remove(classNames.carousel.dotActive);
        thisPage.index = 0;
        thisPage.firstComment.classList.add(classNames.carousel.active);
        thisPage.dotOne.classList.add(classNames.carousel.dotActive);
        thisPage.carousel();
      }, 4000);
    }
  }
}
export default MainPage;