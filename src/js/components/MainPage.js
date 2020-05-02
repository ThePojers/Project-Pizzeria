
import {templates, select} from '../settings.js';
import utils from '../utils.js';

class MainPage {

  constructor(){
    const thisPage = this;

    thisPage.renderInMenu();
    thisPage.carousel();
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
    thisPage.element = document.querySelector('.first-comment');
    console.log(thisPage.element);


    
    thisPage.element.classList.add('dupa');
    // thisPage.element.animate([
    //   // keyframes
    //   { transform: 'translateX(0px)' }, 
    //   { transform: 'translateX(500px)' }
    // ], { 
    //   // timing options
      
    //   duration: 1000,
    //   iterations: 10,
    // });

  }
}
export default MainPage;