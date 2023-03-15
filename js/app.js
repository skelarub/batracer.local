/* eslint-disable no-trailing-spaces */
/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable space-before-blocks */
(function () {
  'use strict';

  ko.applyBindings(new BatracerCalculator());
}());

function BatracerCalculator () {
  'use strict';

  var self = this;

  // starting values
  self.weatherConditions = ko.observableArray([
    new WeatherCondition('Bone Dry (0)', 0),
    new WeatherCondition('Greasy (9)', 9),
    new WeatherCondition('Moist (18)', 18),
    new WeatherCondition('Drizzle (27)', 27),
    new WeatherCondition('Light Rain (36)', 36),
    new WeatherCondition('Rain (45)', 45),
    new WeatherCondition('Wet and Slippery (54)', 54),
    new WeatherCondition('Steady Rain (63)', 63),
    new WeatherCondition('Heavy Rain (72)', 72),
    new WeatherCondition('Treacherous Rain and Spray (81)', 81),
    new WeatherCondition('Monsoon (90)', 90),
    new WeatherCondition('Storm (100)', 100)
  ]);

  self.wings = ko.observable(true);
  self.suspension = ko.observable(true);
  self.antiRollBar = ko.observable(true);
  self.rideHeight = ko.observable(true);
  self.tyrePressure = ko.observable(true);
  self.gearsI = ko.observable(true);
  self.brakeBiasI = ko.observable(true);
  self.wheelStagerDifferentialI = ko.observable(true);

  self.uncheckedWings = ko.observable('');
  self.uncheckedSuspension = ko.observable('');
  self.uncheckedAntiRollBar = ko.observable('');
  self.uncheckedRideHeight = ko.observable('');
  self.uncheckedTyrePressure = ko.observable('');
  self.uncheckedGears = ko.observable('');
  self.uncheckedBrakeBias = ko.observable('');
  self.uncheckedWheelStagerDifferential = ko.observable('');

  self.results = ko.observable('');
  self.myScriptPaste = ko.observable('');

  self.dryToWet = ko.observable('true');

  self.weatherAdjustment = ko.observable(new WeatherCondition('Bone Dry (0)', 0));
  self.specification = ko.observable(0);
  self.range = ko.observable(0);
  self.rangeMin = ko.observable(self.weatherAdjustment().rangeMin);
  self.rangeMax = ko.observable(self.weatherAdjustment().rangeMax);
  self.tmpValue = ko.observable(self.weatherAdjustment());

  // sort the inserted text
  self.myScriptPaste.subscribe(function (newValue){
    var arraySetup = newValue.split('\n');

    self.wings(false);
    self.suspension(false);
    self.antiRollBar(false);
    self.rideHeight(false);
    self.tyrePressure(false);
    self.gearsI(false);
    self.brakeBiasI(false);
    self.wheelStagerDifferentialI(false);

    arraySetup.forEach(function (item, index, arr){
      if (item.length > 0){
        switch (item) {
          case 'Wings':
            self.wings(true);
            self.wingsFront(arr[index + 1]);
            self.wingsRear(arr[index + 2]);
          break;
          case 'Suspension':
            self.suspension(true);
            self.suspensionFront(arr[index + 1]);
            self.suspensionRear(arr[index + 2]);
          break;
          case 'Anti-Roll Bar':
            self.antiRollBar(true);
            self.antiRollBarFront(arr[index + 1]);
            self.antiRollBarRear(arr[index + 2]);
          break;
          case 'Ride Height':
            self.rideHeight(true);
            self.rideHeightFront(arr[index + 1]);
            self.rideHeightRear(arr[index + 2]);
          break;
          case 'Tyre Pressure':
            self.tyrePressure(true);
            self.tyrePressureFront(arr[index + 1]);
            self.tyrePressureRear(arr[index + 2]);
          break;
          case 'Gears':
            self.gearsI(true);
            self.gears(arr[index + 1]);
          break;
          case 'Brake Bias':
            self.brakeBiasI(true);
            self.brakeBias(arr[index + 1]);
          break;
          case 'Wheel Stager / Differential':
            self.wheelStagerDifferentialI(true);
            self.wheelStagerDifferential(arr[index + 1]);
          break;
        }
      }
    });
  });

  // if select a value from the drop-down list, change the value in the specification
  self.weatherAdjustment.subscribe(function (newValue){
    self.specification(newValue.weatherAdjustment);
  });
  
  // if the value is changed specification, then set value in the range
  self.specification.subscribe(function (newValue){
    self.range(newValue);
  });

  // at change range
  self.range.subscribe(function (newValue){
    self.specification(newValue);
    self.rangeMin(self.weatherAdjustment().rangeMin);
    self.rangeMax(self.weatherAdjustment().rangeMax);
    self.tmpValue(new WeatherCondition('newValue', parseInt(newValue, 10)));
    self.collectResultString();
  });

  // numbers to enter
  self.wingsFront = ko.observable(0);
  self.wingsRear = ko.observable(0);
  self.suspensionFront = ko.observable(0);
  self.suspensionRear = ko.observable(0);
  self.antiRollBarFront = ko.observable(0);
  self.antiRollBarRear = ko.observable(0);
  self.rideHeightFront = ko.observable(0);
  self.rideHeightRear = ko.observable(0);
  self.tyrePressureFront = ko.observable(0);
  self.tyrePressureRear = ko.observable(0);
  self.gears = ko.observable(0);
  self.brakeBias = ko.observable(0);
  self.wheelStagerDifferential = ko.observable(0);

  // numbers for adjusting
  self.adjustWingsFront = ko.observable(20);
  self.adjustWingsRear = ko.observable(35);
  self.adjustSuspensionFront = ko.observable(-20);
  self.adjustSuspensionRear = ko.observable(-35);
  self.adjustAntiRollBarFront = ko.observable(-18);
  self.adjustAntiRollBarRear = ko.observable(-30);
  self.adjustRideHeightFront = ko.observable(12);
  self.adjustRideHeightRear = ko.observable(14);
  self.adjustTyrePressureFront = ko.observable(10);
  self.adjustTyrePressureRear = ko.observable(12);
  self.adjustGears = ko.observable(-5);
  self.adjustBrakeBias = ko.observable(15);
  self.adjustWheelStagerDifferential = ko.observable(0); // тут требуемый параметр вместо нуля

  // calculating adjusted number
  self.adjustNumber = function (setupVal, changeVal) {

    if (typeof (setupVal) === 'string'){
      setupVal = setupVal.replace(/\s/g, '');
      var ind = setupVal.indexOf('-');

      if (ind > -1 && ind != 0){

        var tmpArr = setupVal.split('-');
        var one = self.adjustNumber(tmpArr[0], changeVal);
        var two = self.adjustNumber(tmpArr[1], changeVal);

        return one + '-' + two;

      }
    }

    var alterednumber = (changeVal / 100) * self.tmpValue().weatherAdjustment;

    setupVal = parseInt(setupVal, 10);

    if (self.dryToWet() === 'true') {
      alterednumber = Math.round(setupVal + alterednumber);
    } else {
      alterednumber = Math.round(setupVal - alterednumber);
    }

    return alterednumber;
  };

  // remove minus and fit a limits
  self.removeminus = function (numberM) {
    if (numberM > 100) {
      numberM = 100;
    } else if (numberM < 0 || isNaN(numberM) || numberM === Infinity) {
      numberM = 0;
    }

    return numberM;
  }

  // define range or number
  self.getValue = function (alterednumber) {
    if (typeof (alterednumber) === 'string'){
      alterednumber = alterednumber.replace(/\s/g, '');
      var ind = alterednumber.indexOf('-');
      if (ind > -1){
        var tmpArr = alterednumber.split('-');
        var one = '';
        var two = '';
        tmpArr.forEach(function (item,index,arr){
          if (item.length == 0){
            arr[index + 1] = (-1) * arr[index + 1];
          } else {
            if (one.length == 0){
              one = self.removeminus(item);
              alterednumber = one;
            } else {
              if (two.length == 0){
                two = self.removeminus(item);
                alterednumber += '-' + two;
              }
            }
          }
        })
      }
    } else {
      alterednumber = self.removeminus(alterednumber);
    }

    return alterednumber;
  }

  // collect at line
  self.collectResultString = function (){
    var resultString = '';

    if (self.dryToWet() === 'true'){resultString += 'WET<BR>'; }
    else {resultString += 'DRY<BR>';}

    if (self.wings()){
      self.uncheckedWings('');
      resultString += 'Wings<BR>' + self.getValue(self.finalWingsFront()) + '<BR>' + self.getValue(self.finalWingsRear()) + '<BR><BR>';
    } else {self.uncheckedWings('unchecked');}
    
    if (self.suspension()){
      self.uncheckedSuspension('');
      resultString += 'Suspension<BR>' + self.getValue(self.finalSuspensionFront()) + '<BR>' + self.getValue(self.finalSuspensionRear()) + '<BR><BR>';
    } else {self.uncheckedSuspension('unchecked');}

    if (self.antiRollBar()){
      self.uncheckedAntiRollBar('');
      resultString += 'Anti-Roll Bar<BR>' + self.getValue(self.finalAntiRollBarFront()) + '<BR>' + self.getValue(self.finalAntiRollBarRear()) + '<BR><BR>';
    } else {self.uncheckedAntiRollBar('unchecked');}

    if (self.rideHeight()){
      self.uncheckedRideHeight('');
      resultString += 'Ride Height<BR>' + self.getValue(self.finalRideHeightFront()) + '<BR>' + self.getValue(self.finalRideHeightRear()) + '<BR><BR>';
    } else {self.uncheckedRideHeight('unchecked');}

    if (self.tyrePressure()){
      self.uncheckedTyrePressure('');
      resultString += 'Tyre Pressure<BR>' + self.getValue(self.finalTyrePressureFront()) + '<BR>' + self.getValue(self.finalTyrePressureRear()) + '<BR><BR>';
    } else {self.uncheckedTyrePressure('unchecked');}

    if (self.gearsI()){
      self.uncheckedGears('');
      resultString += 'Gears<BR>' + self.getValue(self.finalGears()) + '<BR><BR>';
    } else {self.uncheckedGears('unchecked');}

    if (self.brakeBiasI()){
      self.uncheckedBrakeBias('');
      resultString += 'Brake Bias<BR>' + self.getValue(self.finalBrakeBias()) + '<BR><BR>';
    } else {self.uncheckedBrakeBias('unchecked');}

    if (self.wheelStagerDifferentialI()){
      self.uncheckedWheelStagerDifferential('');
      resultString += 'Wheel Stager / Differential<BR>' + self.getValue(self.finalWheelStagerDifferential()) + '<BR>';
    } else {self.uncheckedWheelStagerDifferential('unchecked');}

    self.results(resultString);

  }

  // final calculated numbers
  var objTmp = {
    'finalWingsFront': { 'one': 'wingsFront', 'two': 'adjustWingsFront' },
    'finalWingsRear': { 'one': 'wingsRear', 'two': 'adjustWingsRear' },
    'finalSuspensionFront': { 'one': 'suspensionFront', 'two': 'adjustSuspensionFront' },
    'finalSuspensionRear': { 'one': 'suspensionRear', 'two': 'adjustSuspensionRear' },
    'finalAntiRollBarFront': { 'one': 'antiRollBarFront', 'two': 'adjustAntiRollBarFront' },
    'finalAntiRollBarRear': { 'one': 'antiRollBarRear', 'two': 'adjustAntiRollBarRear' },
    'finalRideHeightFront': { 'one': 'rideHeightFront', 'two': 'adjustRideHeightFront' },
    'finalRideHeightRear': { 'one': 'rideHeightRear', 'two': 'adjustRideHeightRear' },
    'finalTyrePressureFront': { 'one': 'tyrePressureFront', 'two': 'adjustTyrePressureFront' },
    'finalTyrePressureRear': { 'one': 'tyrePressureRear', 'two': 'adjustTyrePressureRear' },
    'finalGears': { 'one': 'gears', 'two': 'adjustGears' },
    'finalBrakeBias': { 'one': 'brakeBias', 'two': 'adjustBrakeBias' },
    'finalWheelStagerDifferential': { 'one': 'wheelStagerDifferential', 'two': 'adjustWheelStagerDifferential' },
  }
  Object.keys(objTmp).map(function (objectKey) {
    var item = objTmp[objectKey];
    self[objectKey] = ko.computed(function () {
      return self.adjustNumber(self[item.one](), self[item.two]());
    });
  });

  // sign function collectResultString to change variables
  var arrTmp = ['wings', 'suspension', 'antiRollBar', 'rideHeight', 'tyrePressure', 'gearsI', 'brakeBiasI', 'dryToWet', 'wingsFront', 'wingsRear', 'suspensionFront', 'suspensionRear',
  'antiRollBarFront', 'antiRollBarRear', 'rideHeightFront', 'rideHeightRear', 'tyrePressureFront', 'tyrePressureRear', 'gears', 'brakeBias', 'wheelStagerDifferentialI'];
  arrTmp.forEach(function (item){
    self[item].subscribe(function (){
      self.collectResultString();
    });
  });

}

// form an object
function WeatherCondition (key, value) {
  'use strict';
  this.displayName = key;
  this.weatherAdjustment = value;
  this.rangeMin = value;
  this.rangeMax = (value < 100) ? value + 9 : value;
}