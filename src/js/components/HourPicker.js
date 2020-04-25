/* global rangeSlider */

import BaseWidget from './BaseWidget.js';
import { select, settings } from '../settings.js';
import utils from '../utils.js';


class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);

    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    console.log(thisWidget.dom.output);
    console.log(thisWidget.dom.input);
    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value;
    
  }
  initPlugin(){
    const thisWidget = this;
    rangeSlider.create(thisWidget.dom.input);
    thisWidget.dom.input.addEventListener('input', function(){
      thisWidget.value = thisWidget.dom.input.value;
    });
  }
  parseValue(value){
    console.log(utils.numberToHour(parseInt(value)));
    return utils.numberToHour(parseInt(value));
  }
  isValid(){
    return true;
  }
  renderValue(){
    const thisWidget = this;
    thisWidget.dom.output.innerHTML = thisWidget.value;
    console.log(thisWidget.dom.output);
  
  }
}

export default HourPicker;