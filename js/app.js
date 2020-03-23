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
    new WeatherCondition('Bone Dry (9)', 9, 9, 18),
    new WeatherCondition('Greasy (0)', 0, 0, 9),
    new WeatherCondition('Moist (18)', 18, 18, 27),
    new WeatherCondition('Drizzle (27)', 27, 27, 36),
    new WeatherCondition('Light Rain (36)', 36, 36, 45),
    new WeatherCondition('Rain (45)', 45, 45, 54),
    new WeatherCondition('Wet and Slippery (54)', 54, 54, 63),
    new WeatherCondition('Steady Rain (63)', 63, 63, 72),
    new WeatherCondition('Heavy Rain (72)', 72, 72, 81),
    new WeatherCondition('Treacherous Rain and Spray (81)', 81, 81, 90),
    new WeatherCondition('Monsoon (90)', 90, 90, 100),
    new WeatherCondition('Storm (100)', 100, 100, 100)
  ]);

  self.wings = ko.observable('true');
  self.suspension = ko.observable('true');
  self.antiRollBar = ko.observable('true');
  self.rideHeight = ko.observable('true');
  self.tyrePressure = ko.observable('true');
  self.gearsI = ko.observable('true');
  self.brakeBiasI = ko.observable('true');

  self.results = ko.observable('');

  self.dryToWet = ko.observable('true');

  self.weatherAdjustment = ko.observable(0);
  self.specification = ko.observable(0);
  self.range = ko.observable(0);
  self.rangeMin = ko.observable(0);
  self.rangeMax = ko.observable(0);
  self.tmpValue = ko.observable(0);

  self.weatherAdjustment.subscribe( function (newValue){
    self.specification(newValue.weatherAdjustment);
  });
  
  self.specification.subscribe( function (newValue){
    self.range(newValue);
  });

  self.range.subscribe( function (newValue){
    self.specification(newValue);
    self.rangeMin(self.weatherAdjustment().rangeMin);
    self.rangeMax(self.weatherAdjustment().rangeMax);
    self.tmpValue(new WeatherCondition('newValue', parseInt(newValue, 10)));
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

}

function WeatherCondition (key, value, min, max) {
  'use strict';
  this.displayName = key;
  this.weatherAdjustment = value;
  this.rangeMin = min;
  this.rangeMax = max;
}