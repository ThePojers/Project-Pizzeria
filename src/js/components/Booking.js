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
        thisBooking.clicked();

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
    
    
    for(let table of thisBooking.dom.tables){
      
      console.log(thisBooking.booked);
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      console.log(tableId);

      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
        console.log(tableId);
      }

      if(
        !thisBooking.allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.removeAttribute('id');
        table.classList.add(classNames.booking.tableBooked);
        
      } else {
        table.id = tableId;
        
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
    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.clicked();
    });
  } 
  clicked(){
    console.log('WYKONUJE FUNKCJE CLICKED');
    const thisBooking = this;
    for(let table of thisBooking.dom.tables){

      table.removeEventListener('click', function(){
        table.classList.toggle(classNames.booking.clickedTable);
      });

      table.classList.remove(classNames.booking.clickedTable);

      thisBooking.clickAttribute = table.getAttribute('id');

      if(!isNaN(thisBooking.clickAttribute)){
        thisBooking.clickAttribute = parseInt(thisBooking.clickAttribute);
        console.log(thisBooking.clickAttribute);
      }


      console.log(thisBooking.clickAttribute);
      if(thisBooking.clickAttribute == 1){
        console.log('1111111111111111111111111111');
        table.addEventListener('click', function(){
          table.classList.toggle(classNames.booking.clickedTable);
        });
      }
      if(thisBooking.clickAttribute == 2){
        console.log('222222222222222222222222');
        table.addEventListener('click', function(){
          table.classList.toggle(classNames.booking.clickedTable);
        });
      }
      if(thisBooking.clickAttribute == 3){
        table.addEventListener('click', function(){
          console.log('333333333333333333333333');
          table.classList.toggle(classNames.booking.clickedTable);
        });
      }
    }
    console.log(thisBooking.dom.tables);

    // for(let table of thisBooking.dom.tables){
    //   thisBooking.clickAttribute = table.getAttribute('id');
    //   const dupa = typeof thisBooking.clickAttribute;
    //   console.log(dupa);
    //   table.removeEventListener('click')
    //   console.log(thisBooking.booked[thisBooking.date][thisBooking.hour]);
    //   for(let reservedTable in thisBooking.booked[thisBooking.date][thisBooking.hour]){

    //   }
    // }



    // if(
    //   typeof thisBooking.clickManager == 'undefined'
    // ){
    //   console.log('DUPA');
    //   table.removeEventListener('click', function(){
    //     table.classList.add(classNames.booking.clickedTable);
    //   });
    // } else {

    //   table.removeEventListener('click', function(){
    //     table.classList.add(classNames.booking.clickedTable);
    //   });
    // }



    //   const thisBooking = this;
    //   thisBooking.dom.dataPicker.addEventListener('update', function(){
    //     for(let table of thisBooking.dom.tables){
    //       table.removeEventListener('click', function(){
    //         table.classList.add(classNames.booking.clickedTable);
    //       });
    //       let tableId = table.getAttribute(settings.booking.tableIdAttribute); 
    //       if(!isNaN(tableId)){
    //         tableId = parseInt(tableId);

    //       if(
    //         !thisBooking.allAvailable
    //         &&
    //         thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
    //       )
    //     }
    //   });
      
          
    // table.removeEventListener('click', function(){
    //   table.classList.remove(classNames.booking.clickedTable);
    // });
    // table.classList.remove(classNames.booking.clickedTable);
    
    // table.addEventListener('click', function(){
    //   table.classList.toggle(classNames.booking.clickedTable);
    // });
    // table.classList.remove(classNames.booking.tableBooked);
  }
}
export default Booking;