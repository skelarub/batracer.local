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

  self.uncheckedWings = ko.observable('');
  self.uncheckedSuspension = ko.observable('');
  self.uncheckedAntiRollBar = ko.observable('');
  self.uncheckedRideHeight = ko.observable('');
  self.uncheckedTyrePressure = ko.observable('');
  self.uncheckedGears = ko.observable('');
  self.uncheckedBrakeBias = ko.observable('');

  self.results = ko.observable('');
  self.myScriptPaste = ko.observable('');

  self.dryToWet = ko.observable('true');

  self.weatherAdjustment = ko.observable(new WeatherCondition('Bone Dry (0)', 0));
  self.specification = ko.observable(0);
  self.range = ko.observable(0);
  self.rangeMin = ko.observable(self.weatherAdjustment().rangeMin);
  self.rangeMax = ko.observable(self.weatherAdjustment().rangeMax);
  self.tmpValue = ko.observable(self.weatherAdjustment());

  self.myScriptPaste.subscribe(function (newValue){
    var arraySetup = newValue.split('\n');
    var currentName = '';

    self.wings(false);
    self.suspension(false);
    self.antiRollBar(false);
    self.rideHeight(false);
    self.tyrePressure(false);
    self.gearsI(false);
    self.brakeBiasI(false);

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
        }
      }
    });
    
  });

  self.weatherAdjustment.subscribe(function (newValue){
    self.specification(newValue.weatherAdjustment);
  });
  
  self.specification.subscribe(function (newValue){
    self.range(newValue);
  });

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

  self.removeminus = function (numberM) {
    if (numberM > 100) {
      numberM = 100;
    } else if (numberM < 0 || isNaN(numberM) || numberM === Infinity) {
      numberM = 0;
    }

    return numberM;
  }

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
      resultString += 'Brake Bias<BR>' + self.getValue(self.finalBrakeBias()) + '<BR>';
    } else {self.uncheckedBrakeBias('unchecked');}

    self.results(resultString);

  }

  // final calculated numbers
  self.finalWingsFront = ko.computed(function () {
    return self.adjustNumber(self.wingsFront(), self.adjustWingsFront());
  });

  self.finalWingsRear = ko.computed(function () {
    return self.adjustNumber(self.wingsRear(), self.adjustWingsRear());
  });

  self.finalSuspensionFront = ko.computed(function () {
    return self.adjustNumber(self.suspensionFront(), self.adjustSuspensionFront());
  });

  self.finalSuspensionRear = ko.computed(function () {
    return self.adjustNumber(self.suspensionRear(), self.adjustSuspensionRear());
  });

  self.finalAntiRollBarFront = ko.computed(function () {
    return self.adjustNumber(self.antiRollBarFront(), self.adjustAntiRollBarFront());
  });

  self.finalAntiRollBarRear = ko.computed(function () {
    return self.adjustNumber(self.antiRollBarRear(), self.adjustAntiRollBarRear());
  });

  self.finalRideHeightFront = ko.computed(function () {
    return self.adjustNumber(self.rideHeightFront(), self.adjustRideHeightFront());
  });

  self.finalRideHeightRear = ko.computed(function () {
    return self.adjustNumber(self.rideHeightRear(), self.adjustRideHeightRear());
  });

  self.finalTyrePressureFront = ko.computed(function () {
    return self.adjustNumber(self.tyrePressureFront(), self.adjustTyrePressureFront());
  });

  self.finalTyrePressureRear = ko.computed(function () {
    return self.adjustNumber(self.tyrePressureRear(), self.adjustTyrePressureRear());
  });

  self.finalGears = ko.computed(function () {
    return self.adjustNumber(self.gears(), self.adjustGears());
  });

  self.finalBrakeBias = ko.computed(function () {
    return self.adjustNumber(self.brakeBias(), self.adjustBrakeBias());
  });

  self.wings.subscribe(function (){
    self.collectResultString();
  });
  self.suspension.subscribe(function (){
    self.collectResultString();
  });
  self.antiRollBar.subscribe(function (){
    self.collectResultString();
  });
  self.rideHeight.subscribe(function (){
    self.collectResultString();
  });
  self.tyrePressure.subscribe(function (){
    self.collectResultString();
  });
  self.gearsI.subscribe(function (){
    self.collectResultString();
  });
  self.brakeBiasI.subscribe(function (){
    self.collectResultString();
  });
  self.dryToWet.subscribe(function (){
    self.collectResultString();
  });
  self.wingsFront.subscribe(function (){
    self.collectResultString();
  });
  self.wingsRear.subscribe(function (){
    self.collectResultString();
  });;
  self.suspensionFront.subscribe(function (){
    self.collectResultString();
  });;
  self.suspensionRear.subscribe(function (){
    self.collectResultString();
  });;
  self.antiRollBarFront.subscribe(function (){
    self.collectResultString();
  });;
  self.antiRollBarRear.subscribe(function (){
    self.collectResultString();
  });;
  self.rideHeightFront.subscribe(function (){
    self.collectResultString();
  });;
  self.rideHeightRear.subscribe(function (){
    self.collectResultString();
  });;
  self.tyrePressureFront.subscribe(function (){
    self.collectResultString();
  });;
  self.tyrePressureRear.subscribe(function (){
    self.collectResultString();
  });;
  self.gears.subscribe(function (){
    self.collectResultString();
  });;
  self.brakeBias.subscribe(function (){
    self.collectResultString();
  });;

}

function WeatherCondition (key, value) {
  'use strict';
  this.displayName = key;
  this.weatherAdjustment = value;
  this.rangeMin = value;
  this.rangeMax = (value < 100) ? value + 9 : value;
}