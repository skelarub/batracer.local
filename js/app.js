(function () {
	"use strict";

	ko.applyBindings(new BatracerCalculator());
}());

function BatracerCalculator() {
	"use strict";

	var self = this;

	self.weatherConditions = ko.observableArray([
		new WeatherCondition("Greasy", 0),
		new WeatherCondition("Bone Dry", 9),
		new WeatherCondition("Moist", 18),
		new WeatherCondition("Drizzle", 27),
		new WeatherCondition("Light Rain", 36),
		new WeatherCondition("Rain", 45),
		new WeatherCondition("Wet and Slippery", 54),
		new WeatherCondition("Steady Rain", 63),
		new WeatherCondition("Heavy Rain", 72),
		new WeatherCondition("Treacherous Rain and Spray", 81),
		new WeatherCondition("Monsoon", 90),
		new WeatherCondition("Storm", 100)
	]);

	self.dryToWet = ko.observable("true");
	self.weatherAdjustment = ko.observable(0);

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
		var alterednumber = (changeVal / 100) * self.weatherAdjustment().weatherAdjustment;

		setupVal = parseInt(setupVal, 10);

		if (self.dryToWet() === "true") {
			alterednumber = Math.round(setupVal + alterednumber);
		} else {
			alterednumber = Math.round(setupVal - alterednumber);
		}

		if (alterednumber > 100) {
			alterednumber = 100;
		} else if (alterednumber < 0 || isNaN(alterednumber) || alterednumber === Infinity) {
			alterednumber = 0;
		}

		return alterednumber;
	};

	// final calculated numbers
	self.finalWingsFront = ko.computed(function () {
		var value = self.adjustNumber(self.wingsFront(), self.adjustWingsFront());
		return value;
	});

	self.finalWingsRear = ko.computed(function () {
		var value = self.adjustNumber(self.wingsRear(), self.adjustWingsRear());
		return value;
	});

	self.finalSuspensionFront = ko.computed(function () {
		var value = self.adjustNumber(self.suspensionFront(), self.adjustSuspensionFront());
		return value;
	});

	self.finalSuspensionRear = ko.computed(function () {
		var value = self.adjustNumber(self.suspensionRear(), self.adjustSuspensionRear());
		return value;
	});

	self.finalAntiRollBarFront = ko.computed(function () {
		var value = self.adjustNumber(self.antiRollBarFront(), self.adjustAntiRollBarFront());
		return value;
	});

	self.finalAntiRollBarRear = ko.computed(function () {
		var value = self.adjustNumber(self.antiRollBarRear(), self.adjustAntiRollBarRear());
		return value;
	});

	self.finalRideHeightFront = ko.computed(function () {
		var value = self.adjustNumber(self.rideHeightFront(), self.adjustRideHeightFront());
		return value;
	});

	self.finalRideHeightRear = ko.computed(function () {
		var value = self.adjustNumber(self.rideHeightRear(), self.adjustRideHeightRear());
		return value;
	});

	self.finalTyrePressureFront = ko.computed(function () {
		var value = self.adjustNumber(self.tyrePressureFront(), self.adjustTyrePressureFront());
		return value;
	});

	self.finalTyrePressureRear = ko.computed(function () {
		var value = self.adjustNumber(self.tyrePressureRear(), self.adjustTyrePressureRear());
		return value;
	});

	self.finalGears = ko.computed(function () {
		var value = self.adjustNumber(self.gears(), self.adjustGears());
		return value;
	});

	self.finalBrakeBias = ko.computed(function () {
		var value = self.adjustNumber(self.brakeBias(), self.adjustBrakeBias());
		return value;
	});
}

function WeatherCondition(key, value) {
	"use strict";
	this.displayName = key;
	this.weatherAdjustment = value;
}