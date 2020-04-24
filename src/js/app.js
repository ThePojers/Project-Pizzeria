import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

const app = {
  initBooking: function(){
    const thisApp = this; 
    thisApp.bookingContainer = document.querySelector(select.containerOf.booking);

    thisApp.bookingWidget = new Booking(thisApp.bookingContainer);
  },
  initPages: function(){
    const thisApp = this;
    
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    console.log('thisApp.Pages', thisApp.pages);
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    const idFromHash = window.location.hash.replace('#/', '');
    
    let pageMatchingHash = thisApp.pages[0].id;
    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }
    thisApp.activatePage(pageMatchingHash);
    
    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(){
        const clickedElemnent = this;
        event.preventDefault();
        // get page id from href attribute
        const Id = clickedElemnent.getAttribute('href').replace('#', '');
        // run thisApp.activatePage with that ID
        thisApp.activatePage(Id);

        // change URL 
        window.location.hash = '#/' + Id;
      });
    }
  },
  activatePage: function(pageId){
    const thisApp = this;

    /* add class "active" to matching pages, remove from non-matching */
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
      
    /* add class "active" to matching links, remove from non-matching */
    for(let link of  thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }

    
  }, 
  initMenu: function(){
    const thisApp = this; 
    // console.log('ThisApp.data:', thisApp.data);
    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },
  initData: function(){
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
    fetch(url).then(function(rawResponse){
      return rawResponse.json();
    }).then(function(parsedResponse){
      console.log('parsedResponse', parsedResponse);
      thisApp.data.products = parsedResponse;
      thisApp.initMenu(); 
    });
  },
  init: function(){
    const thisApp = this;
    // console.log('*** App starting ***');
    // console.log('thisApp:', thisApp);
    // console.log('classNames:', classNames);
    // console.log('settings:', settings);
    // console.log('templates:', templates);
    thisApp.initPages();
    thisApp.initData();
    console.log('ThisApp.data:', thisApp.data);
    thisApp.initCart();
    thisApp.initBooking();
  },
  initCart: function(){
    
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);
    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },
};

app.init();