/* global flatpickr */

import BaseWidget from './BaseWidget.js';
import utils from '../utils.js';
import { select, settings } from '../settings.js';



class DataPicker extends BaseWidget {
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();

  }

  initPlugin(){
    const thisWidget = this;
    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate:  thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      'disable': [
        function(date) {
        // return true to disable
          return (date.getDay() === 1);
        }
      ],
      'locale': {
        'firstDayOfWeek': 1 // start week on Monday
      },
      onChange: function(selectedDates, dateStr){
        thisWidget.value = dateStr;
      }
    });

  }
  parseValue(value){
    return value;
  }
  isValid(){
    return true;
  }
  renderValue(){  
  }


}

export default DataPicker;