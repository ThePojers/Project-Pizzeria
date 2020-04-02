/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product{
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.initAccordion();
      console.log('new product:', thisProduct);
    }
    renderInMenu(){
      const thisProduct = this;
      // Stworzenie HTML bazując na szablonie
      const generatedHTML = templates.menuProduct(thisProduct.data);
      // stworzenie elementu używając utilis.createElementFromHTML
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      // znalezienie menu containera
      const menuContainer = document.querySelector(select.containerOf.menu);
      // dodanie elementu do menu conaitnera
      menuContainer.appendChild(thisProduct.element);
    }
    initAccordion(){
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */
      const clickableElement = document.querySelector(select.menuProduct.clickable);
      console.log(clickableElement);
      /* START: click event listener to trigger */
      clickableElement.addEventListener('click', function(){
        /* prevent default action for event */
        event.preventDefault();
        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle('active');
        /* find all active products */
        const activeProduct = document.querySelectorAll('article.active'); 
        console.log(activeProduct);
        /* START LOOP: for each active product */
        for(let activeManagement in activeProduct)
          /* START: if the active product isn't the element of thisProduct */
          if(!activeProduct[activeManagement]){
            console.log(activeProduct)
            /* remove class active for the active product */
            activeManagement.classList.remove('active');
          /* END: if the active product isn't the element of thisProduct */
          }
        /* END LOOP: for each active product */
      });
      /* END: click event listener to trigger */
    }
  }


  const app = {
    initMenu: function(){
      const thisApp = this; 
      console.log('ThisApp.data:', thisApp.data);
      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;
    },
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      thisApp.initData();
      
      console.log('ThisApp.data:', thisApp.data);
      thisApp.initMenu();
      const person = {
        name: 'John',
        surname: 'Doe',
        age: 35
      };
      
      for( let key in person ){
        console.log('Value at key "' + key + '" in person: ' + person[key]);
      }
      
    },
  };

  app.init();
}
