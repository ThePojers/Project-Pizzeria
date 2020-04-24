import { templates, select } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';


class Booking {
  constructor(element){
    console.log(element);

    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();
  }
  render(element){
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    thisBooking.element = utils.createDOMFromHTML(generatedHTML);
    const menuContainer = document.querySelector(select.containerOf.booking);
    menuContainer.appendChild(thisBooking.element);
    console.log('thisBooking.element',thisBooking.element);
    console.log('element', element);
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = element.querySelector(select.booking.hoursAmount);
    console.log('thisBooking.dom.peopleAmount', thisBooking.dom.peopleAmount);
    console.log('thisBooking.dom.hoursAmount',thisBooking.dom.hoursAmount);
  }
  initWidgets(){
    const thisBooking = this;
    console.log(thisBooking);
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }   
}
export default Booking;