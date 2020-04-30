
import {classNames, templates, select, settings} from '../settings.js';
import utils from '../utils.js';

import CartProduct from './CartProduct.js';

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
      console.log(thisCart.dom.phone);
      thisCart.sendOrder();

    });
    console.log(thisCart.dom.phone);
  }

  add(menuProduct){
    console.log(menuProduct);
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
      totalPrice: thisCart.totalPrice,
      phoneNumber: thisCart.dom.phone.value,
      adress: thisCart.dom.adress.value,
      totalAmound:  thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      delieryFree: thisCart.deliveryFee,
      products: [],
    
    };
    for(let product of thisCart.products){
      product.getData();
      const dataOfProduct = product.getData();
      payload.products.push(dataOfProduct);
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
export default Cart;