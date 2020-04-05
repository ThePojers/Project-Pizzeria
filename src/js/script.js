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
      imageInsider: '.product__images img',
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
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.processOrder();
      
      // console.log('new product:', thisProduct);
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
    getElements(){
      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    }
    initAccordion(){
      const thisProduct = this;

      /* START: click event listener to trigger */
      thisProduct.accordionTrigger.addEventListener('click', function() {
        /* prevent default action for event */
        event.preventDefault();
        /* toggle active class on element of thisProduct */ 
        thisProduct.element.classList.toggle('active');
        /* find all active products */
        const activeProducts = document.querySelectorAll('article.active'); 
        /* START LOOP: for each active product */
        for (let activeProduct of activeProducts ) {
          /* START: if the active product isn't the element of thisProduct */
          if(activeProduct != thisProduct.element){
            console.log(thisProduct.element);
            /* remove class active for the active product */
            activeProduct.classList.remove('active');
          /* END: if the active product isn't the element of thisProduct */
          }
        }
        /* END LOOP: for each active product */
      });
      /* END: click event listener to trigger */
    }
    initOrderForm(){
      const thisProduct = this;
      console.log('Witam serdecznie Console log znajudej sie w initOrderForm');
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
    }
    processOrder(){
      const thisProduct = this;
      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      const formData = utils.serializeFormToObject(thisProduct.form);
      /* set variable price to equal thisProduct.data.price */
      let price = thisProduct.data.price;
      
      /* START LOOP: for each paramId in thisProduct.data.params */
      for( let paramId in thisProduct.data.params){
        /* save the element in thisProduct.data.params with key paramId as const param */
        const param = thisProduct.data.params[paramId];
        /* START LOOP: for each optionId in param.options */
        for( let optionId in param.options ){
          /* save the element in param.options with key optionId as const option */
          const option = param.options[optionId];

          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
          /* START IF: if option is selected and option is not default */
          if(optionSelected && !option.default){
            /* add price of option to variable price */
            price = price + option.price;
            /* END IF: if option is selected and option is not default */
          }
          /* START ELSE IF: if option is not selected and option is default */
          else if (!optionSelected && option.default){
          /* deduct price of option from price */
            price = price - option.price;
          } 
          let images =  thisProduct.imageWrapper.querySelectorAll(`.${paramId}-${optionId}`);
          console.log(images);
          if(optionSelected){
            for( let image of images){
              console.log(image)
              image.classList.add(classNames.menuProduct.imageVisible);
            }
          } else{
            for( let image of images){
              image.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
        }
      }
      thisProduct.priceElem.innerHTML = price; 
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
    },
  };

  app.init();
}
