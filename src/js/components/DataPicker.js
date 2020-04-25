import BaseWidget from './BaseWidget.js';
// import flatpickr from 'flatpickr';
import utils from '../utils.js';
import { select, settings } from '../settings.js';



class DataPicker extends BaseWidget {
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;
    console.log(wrapper);
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();

  }

  initPlugin(){
    const thisWidget = this;
    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = thisWidget.minDate + settings.datePicker.maxDaysInFuture;
    // flatpickr(element, options);
    // zainicjowac plugin flatpickr 
    flatpickr(thisWidget.dom.input, {

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