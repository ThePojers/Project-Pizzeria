
import { templates, select, settings, classNames } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DataPicker from './DataPicker.js';
import HourPicker from './HourPicker.js';


class Booking {
  constructor(element){


    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initAction();
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
      for(let table of  item.partyTable){
        thisBooking.makeBooked(item.date, item.hour, item.duration, table);
      }
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

    thisBooking.phoneNumber = element.querySelector(select.booking.phone);
    thisBooking.address = element.querySelector(select.booking.address);
    thisBooking.bookButton = element.querySelector(select.booking.button);
    thisBooking.waterStarter = element.querySelector(select.booking.waterStarter);
    console.log(thisBooking.waterStarter);
    thisBooking.breadStarter = element.querySelector(select.booking.breadStarter);
    console.log(thisBooking.breadStarter);
    thisBooking.peopleAmount = element.querySelector(select.booking.peopleAmountInput);
    thisBooking.hoursAmount = element.querySelector(select.booking.hoursAmountInput);
    thisBooking.table = [];

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
    console.log(thisBooking.date);
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    thisBooking.allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      thisBooking.allAvailable = true;
    }

    console.log(thisBooking.hoursAmount.value);
    for(let table of thisBooking.dom.tables){
   
      console.log(thisBooking.booked);
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      console.log( tableId);

      if(!isNaN( tableId)){
        tableId = parseInt( tableId);
        console.log( tableId);
      }

      if(
        !thisBooking.allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.remove(classNames.booking.clickedTable);
        table.classList.add(classNames.booking.tableBooked);

      } else {
        table.classList.remove(classNames.booking.clickedTable);
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
    thisBooking.table = [];
    console.log('TU JEST RESET', thisBooking.table);
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

  initAction(){
    const thisBooking = this;
    thisBooking.starters = [];
    thisBooking.water = 'water';
    thisBooking.bread = 'bread';
    thisBooking.waterStarterChecker = false;
    thisBooking.breadStarterChecker = false;


    
    thisBooking.bookButton.addEventListener('click', function(){
      event.preventDefault();
      console.log(thisBooking.table.length);
      if(thisBooking.table.length > 0){
        thisBooking.sendOrder();
      } else {
        alert('Please select table');
      }

      
    });

    for(let table of thisBooking.dom.tables){
      
      table.addEventListener('click', function(){


        let tableId = table.getAttribute(settings.booking.tableIdAttribute);
        console.log( tableId);
  
        if(!isNaN( tableId)){
          tableId = parseInt( tableId);
          console.log( tableId);
        }
  
        if(
          !thisBooking.allAvailable
          &&
          !thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
        ){
          table.classList.add(classNames.booking.clickedTable);
          if(thisBooking.table.indexOf(tableId) == -1){
            thisBooking.table.push(tableId);
            console.log('tutaj dodaje elementy', thisBooking.table);
          }
          console.log('nie dodałem elementu bo już jest ', thisBooking.table);
        } else if (thisBooking.allAvailable == true){
          
          if(thisBooking.table.indexOf(tableId) == -1){
            table.classList.add(classNames.booking.clickedTable);
            thisBooking.table.push(tableId);
          }
          console.log('nie dodałem elementu bo już jest 2222222222', thisBooking.table);
        }
      });
    }

    thisBooking.waterStarter.addEventListener('click', function(){
      thisBooking.waterStarterChecker = !thisBooking.waterStarterChecker;
      if(thisBooking.waterStarterChecker == false ){
        thisBooking.starters.splice(thisBooking.starters.indexOf(thisBooking.water), 1);
      } else if(thisBooking.waterStarterChecker == true){
        thisBooking.starters.push(thisBooking.water);
      }
    });

    thisBooking.breadStarter.addEventListener('click', function(){
      thisBooking.breadStarterChecker = !thisBooking.breadStarterChecker;
      if(thisBooking.breadStarterChecker == false ){
        thisBooking.starters.splice(thisBooking.starters.indexOf(thisBooking.bread), 1);
      } else if(thisBooking.breadStarterChecker == true){
        thisBooking.starters.push(thisBooking.bread);
      }
    });
  }

  sendOrder(){
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;
   
    for(let tableId of thisBooking.table){

      thisBooking.tableId = tableId;
    }

    thisBooking.payload = {
      hour: thisBooking.hourPicker.value,
      date: thisBooking.date,
      table: thisBooking.tableId,
      partyTable: thisBooking.table,
      people: thisBooking.peopleAmount.value,
      duration: thisBooking.hoursAmount.value,
      starters: thisBooking.starters,
      address: thisBooking.address.value,
      phoneNumber: thisBooking.phoneNumber.value,
    };
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(thisBooking.payload),
    };

    fetch(url, options).then(function(response){
      return response.json();
    }).then(function(parsedResponse){
      console.log('parsedResponse', parsedResponse);
      for(let table of thisBooking.table){
        thisBooking.makeBooked(thisBooking.date, thisBooking.hourPicker.value, thisBooking.hoursAmount.value, table);
      }
      thisBooking.updateDOM();
      alert('Thanks for booking');
    });
  }

}
export default Booking;