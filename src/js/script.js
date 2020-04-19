/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
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
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };
  
  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };
  
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    db: {
      url: '//localhost:3131',
      product: 'product',
      order: 'order',
    },
    // CODE ADDED END
  };
  
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };

  class Product {
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
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
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }
    initAccordion(){
      const thisProduct = this;

      /* START: click event listener to trigger */
      thisProduct.accordionTrigger.addEventListener('click', function() {
        /* prevent default action for event */
        event.preventDefault();
        /* toggle active class on element of thisProduct */ 
        thisProduct.element.classList.toggle(classNames.menuProduct.imageVisible);
        /* find all active products */
        const activeProducts = document.querySelectorAll(select.all.menuProductsActive); 
        /* START LOOP: for each active product */
        for (let activeProduct of activeProducts ) {
          /* START: if the active product isn't the element of thisProduct */
          if(activeProduct != thisProduct.element){
            // console.log(thisProduct.element);
            /* remove class active for the active product */
            activeProduct.classList.remove(classNames.menuProduct.imageVisible);
          /* END: if the active product isn't the element of thisProduct */
          }
        }
        /* END LOOP: for each active product */
      });
      /* END: click event listener to trigger */
    }
    initOrderForm(){
      const thisProduct = this;
      // console.log('Witam serdecznie Console log znajudej sie w initOrderForm');
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
        thisProduct.addToCart();
      });
    }
    processOrder(){
      const thisProduct = this;
      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      const formData = utils.serializeFormToObject(thisProduct.form);
      /* set variable price to equal thisProduct.data.price */
      thisProduct.params = {};
      // console.log(thisProduct.params);
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
          // console.log(images);
          if(optionSelected){
            if(!thisProduct.params[paramId]){
              thisProduct.params[paramId] = {
                label: param.label,
                options: {},
              };
            }
            thisProduct.params[paramId].options[optionId] = option.label;
           
            for( let image of images){
              // console.log(image);
              image.classList.add(classNames.menuProduct.imageVisible);
            }
          } else{
            for( let image of images){
              image.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
        }
      }
      // console.log(thisProduct.params);
      
      /* multiply price by amount */
      thisProduct.priceSingle = price;
      thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

      /* set the contents of thisProduct.priceElem to be the value of variable price */
      thisProduct.priceElem.innerHTML = thisProduct.price;
    }
    initAmountWidget(){
      const thisProduct = this;
      // console.log(thisProduct.amountWidgetElem);
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', function(){
        thisProduct.processOrder();
      });
    }
    addToCart(){
      const thisProduct = this;
      // console.log(thisProduct);
      thisProduct.name = thisProduct.data.name;
      thisProduct.amount = thisProduct.amountWidget.value;
      app.cart.add(thisProduct);
    }
  }
  
  class AmountWidget {
    constructor (element){
      const thisWidget = this;
      thisWidget.getElements(element);
      thisWidget.value = settings.amountWidget.defaultValue;
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();

      // console.log('amountWigdet:', thisWidget);
      // console.log('constructor argument:', element);
      
    }
    getElements(element){
      const thisWidget = this;
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }
    setValue(value){
      const thisWidget = this; 
      const newValue = parseInt(value);
      // console.log(value);
      // console.log(newValue);
      // console.log(thisWidget.value);
      // TODO: add validations
      if (newValue >= settings.amountWidget.defaultMin && newValue <=  settings.amountWidget.defaultMax) {
        thisWidget.value = newValue; 
        thisWidget.input.value = value;
        thisWidget.annouce();
      } 
      else{
        thisWidget.input.value = thisWidget.value;
      }
    }
    initActions(){
      const thisWidget = this;
      thisWidget.input.addEventListener('change', function(){
        thisWidget.setValue(thisWidget.input.value);
      });
      thisWidget.linkDecrease.addEventListener('click', function(){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });
      thisWidget.linkIncrease.addEventListener('click', function(){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });
    }
    annouce(){
      const thisWidget = this;

      const event = new CustomEvent('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
    }
  }

  class Cart {
    constructor(element){
      const thisCart = this;
      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
      thisCart.products = [];
      
      
      thisCart.getElements(element);
      thisCart.initActions();
      
      // console.log('new Cart', thisCart);
    }

    getElements(element){
      const thisCart = this;
      thisCart.dom = {};
      thisCart.dom.wrapper = element; 
      thisCart.dom.phone = element.querySelector(select.cart.phone);
      thisCart.dom.adress = element.querySelector(select.cart.address);
      thisCart.dom.form = element.querySelector(select.cart.form);
      // console.log(thisCart.dom);
      thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
      // console.log(thisCart.dom.toggleTrigger);
      thisCart.dom.productList = document.querySelector(select.cart.productList);
      thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];
      for(let key of thisCart.renderTotalsKeys){
        thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
      } 

    }

    initActions(){
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click', function(){
        // console.log(thisCart.dom);
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
      thisCart.dom.productList.addEventListener('updated', function(){
        thisCart.update();
      });
      thisCart.dom.productList.addEventListener('remove', function(){
        thisCart.remove(event.detail.cartProduct);
        console.log(event.detail.cartProduct);
      });
      thisCart.dom.form.addEventListener('submit', function(){
        event.preventDefault();
        thisCart.sendOrder();

      });
    }

    add(menuProduct){
      const thisCart = this;
      // console.log('adding product', menuProduct);
      const generatedHTML = templates.cartProduct(menuProduct);
      // console.log(generatedHTML);
      thisCart.generatedDOM = utils.createDOMFromHTML(generatedHTML);
      // console.log(thisCart.generatedDOM);
      thisCart.dom.productList.appendChild(thisCart.generatedDOM);
      thisCart.products.push(new CartProduct(menuProduct, thisCart.generatedDOM));
      // console.log('thisCart.products', thisCart.products);
      thisCart.update();
    }
    update(){
      console.log('HALO1');
      const thisCart = this;
      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0;
      console.log(thisCart.products);
      for( let product of thisCart.products){
        thisCart.subtotalPrice += product.price;
        thisCart.totalNumber += product.amount;
      }
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
      console.log('thsCart.totalNumber', thisCart.totalNumber);
      console.log('thsCart.subtotalPrice', thisCart.subtotalPrice);
      console.log('thsCart.totalPrice', thisCart.totalPrice);
      for(let key of thisCart.renderTotalsKeys){
        for(let elem of thisCart.dom[key]){
          elem.innerHTML = thisCart[key];
        }
      }
    }
    remove(cartProduct){
      const thisCart = this;
      
      const index = thisCart.products.indexOf(cartProduct);
      thisCart.products.splice(index, 1);
      cartProduct.dom.wrapper.remove();
      thisCart.update();

      console.log(thisCart.products);
      console.log(cartProduct.dom.wrapper);
      console.log(index);
      console.log(cartProduct);
    }
    sendOrder(){
      const thisCart = this;
      const url = settings.db.url + '/' + settings.db.order;
      const payload = {
        address: 'test',
        totalPrice: thisCart.totalPrice,
        phoneNumber: thisCart.dom.phone,
        adress: thisCart.dom.adress,
        totalAmound:  thisCart.totalNumber,
        subtotalPrice: thisCart.subtotalPrice,
        delieryFree: thisCart.deliveryFee,
        products: [],
      
      };
      for(let product of thisCart.products){
        payload.products =  product.getData();
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };
      fetch(url, options).then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });
    }
  }

  class CartProduct {
    constructor (menuProduct, element){
      const thisCartProduct = this;

      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));

      thisCartProduct.getElements(element);
      // console.log(thisCartProduct);
      thisCartProduct.initAmountWidget();
      thisCartProduct.initActions();
    }
    getElements(element){
      const thisCartProduct = this;
      thisCartProduct.dom = {};
      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
    }
    initAmountWidget(){
      const thisCartProduct = this;
      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
      thisCartProduct.dom.amountWidget.addEventListener('updated', function(){
        // console.log(thisCartProduct.amountWidget);
        thisCartProduct.amount = thisCartProduct.amountWidget.value;
        thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
      });
    }
    remove(){
      const thisCartProduct = this;
      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct,
        }
      });
      thisCartProduct.dom.wrapper.dispatchEvent(event);
    }
    initActions(){
      const thisCartProduct = this;
      thisCartProduct.dom.edit.addEventListener('click', function(){
        event.preventDefault();
      });
      thisCartProduct.dom.remove.addEventListener('click', function(){
        event.preventDefault();
        thisCartProduct.remove();
      });
    }
    getData(){
      const thisCartProduct = this;
      thisCartProduct.all = {};
      thisCartProduct.all.price = thisCartProduct.price;
      thisCartProduct.all.id = thisCartProduct.id;
      thisCartProduct.all.amount = thisCartProduct.amount;
      thisCartProduct.all.priceSingle = thisCartProduct.priceSingle;
      thisCartProduct.all.params =  thisCartProduct.params;
      return thisCartProduct.all; 
    }
  }

  const app = {
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
      thisApp.initData();
      console.log('ThisApp.data:', thisApp.data);
      thisApp.initCart();
    },
    initCart: function(){
      const thisApp = this;
      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    }
  };

  app.init();
}
