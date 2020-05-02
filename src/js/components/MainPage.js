
import {templates, select} from '../settings.js';
import utils from '../utils.js';

class MainPage {

  constructor(){
    const thisPage = this;

    thisPage.renderInMenu();
      
    
  }

  renderInMenu(){
    const thisPage = this;
    const generatedHTML = templates.mainPage();
    thisPage.element = utils.createDOMFromHTML(generatedHTML);
    const menuContainer = document.querySelector(select.containerOf.mainPage);
    menuContainer.appendChild(thisPage.element);
  }
}
export default MainPage;