import { templates, select, settings, classNames } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DataPicker from './DataPicker.js';
import HourPicker from './HourPicker.js';


class Booking {
  constructor(element){


    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
  }
  getData(){
    const thisBooking = this;

    const startDayParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.dataPicker.minDate);
    const endDayParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.dataPicker.maxDate);

    const params = {
      booking: [
        startDayParam,
        endDayParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDayParam,
        endDayParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDayParam,
      ],
    };
    // console.log(params);

    const urls = {
      booking:            settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
      eventsCurrent:      settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:       settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&'),

    };
    // console.log(urls);
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponse){
        const bookingsResponse = allResponse[0];
        const eventsCurrentResponse = allResponse[1];
        const eventsRepeatResponse = allResponse[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat); 

      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;
  
    thisBooking.booked = {};

    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    console.log(thisBooking.booked);

    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.dataPicker.minDate;
    const maxDate = thisBooking.dataPicker.maxDate;

    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    } 
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    
    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);



    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      // console.log('hourBlock', hourBlock);
      console.log('startHour', startHour);
      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
  
      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  render(element){
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    thisBooking.element = utils.createDOMFromHTML(generatedHTML);
    const menuContainer = document.querySelector(select.containerOf.booking);
    menuContainer.appendChild(thisBooking.element);
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = element.querySelector(select.booking.hoursAmount);
    thisBooking.dom.dataPicker = element.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = element.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = element.querySelectorAll(select.booking.tables);

  }
  updateDOM(){
    const thisBooking = this; 

    thisBooking.date = thisBooking.dataPicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    
    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }
    console.log(thisBooking.dom.tables);
    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      console.log(tableId);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
        console.log(tableId);
      }
    
      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }
  initWidgets(){
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dataPicker = new DataPicker(thisBooking.dom.dataPicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
  }   
}
export default Booking;