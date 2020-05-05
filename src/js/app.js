import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import MainPage from './components/MainPage.js';

const app = {
  initMainPages: function(){
    const thisApp = this; 
    thisApp.findMainPageContainer = document.querySelector(select.containerOf.mainPage);

    thisApp.mainPageContainer = new MainPage(thisApp.findMainPageContainer);
  },
  initBooking: function(){
    const thisApp = this; 
    thisApp.findBookingContainer = document.querySelector(select.containerOf.booking);

    thisApp.bookingContainer = new Booking(thisApp.findBookingContainer);
  },
  initPages: function(){
    const thisApp = this;
   
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    
    thisApp.mainNav = document.querySelectorAll(select.nav.mainNav);
    
    thisApp.mainLink = document.querySelector(select.nav.mainPageLink);
    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[2].id;
    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }
    thisApp.activatePage(pageMatchingHash);
    
    thisApp.mainLink.addEventListener('click', function(){
      const clickedElement = this;
      event.preventDefault();
      const id = clickedElement.getAttribute('href').replace('#', '');
      thisApp.activatePage(id);
      window.location.hash = '#/' + id;
    });

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(){
        const clickedElement = this;
        event.preventDefault();
        // get page id from href attribute
        const id = clickedElement.getAttribute('href').replace('#', '');
        // run thisApp.activatePage with that ID
        thisApp.activatePage(id);
        document.getElementById('cart').classList.remove(classNames.pages.nonActive);
        for(let mainLink of thisApp.mainNav){
          mainLink.classList.remove(classNames.pages.nonActive);
        }
        // change URL 
        window.location.hash = '#/' + id;
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
    thisApp.mainLink.addEventListener('click', function(){
      // delete from header navbars
      for(let mainLink of thisApp.mainNav){
        mainLink.classList.add(classNames.pages.nonActive);
      }
      // delete from header cart 
      document.getElementById('cart').classList.add(classNames.pages.nonActive);
    });
    for(let link of  thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }


    
  }, 
  initMenu: function(){
    const thisApp = this; 
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
      thisApp.data.products = parsedResponse;
      thisApp.initMenu(); 
    });
  },
  init: function(){
    const thisApp = this;
    thisApp.initMainPages();
    thisApp.initPages();
    thisApp.initData();
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