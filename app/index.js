import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import { me as appbit } from "appbit";
import { HeartRateSensor } from "heart-rate";
import { today } from "user-activity";
import { battery } from "power";

function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");

// Get a handle on the <text> element which is used to display date
const theDate = document.getElementById("date");

// Get a handle for the <image> element which is used as the background image
const bg = document.getElementById("backgroundImg");

// Get a handle for the <image> element which is used as the battery icon
const batteryIcon = document.getElementById("batteryImg");

// Get a handle for the <text> element which is used to display heart rate
const heartRate = document.getElementById("heartRate");

// Get a handle for the <text> element which is used to display step count
const stepCount = document.getElementById("stepCount");

// Get a handle for the <text> element which is used to display step count
const calories = document.getElementById("calories");

// Get a handle for the <text> element which is used to display battery level
const batteryLevel = document.getElementById("batteryPercent");




// Time ranges for images
let morning = [6, 11];
let afternoon = [12, 17];
let evening = [18, 21];
let night= [22, 5];

// Images
let shibuya ="shibuya-crossing.png";
let fuji = "mt-fuji.png";
let ninenzaka ="ninenzaka.png";
let shinkansen = "bullet-train-mt-fuji.png";
let batteryFull = "battery-full.png";
let battery75 = "battery-seventyfive.png";
let batteryHalf = "battery-half.png";
let battery25 = "battery-twentyfive.png";
let batteryEmpty = "battery-empty.png";

// Days array
let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
// Months array
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

function dynamicImageSwitch(hour) {
  if ((hour >= morning[0] && hour <= morning[1])) {
    if (bg.href != ninenzaka) {
      bg.href = ninenzaka;
    }
  } else if ((hour >= afternoon[0] && hour <= afternoon[1])) {
    if (bg.href != shinkansen) {
      bg.href = shinkansen;
    }
  } else if ((hour >= evening[0] && hour <= evening[1])) {
    if (bg.href != shibuya) {
      bg.href = shibuya;
    }
  } else if ((hour >= night[0] || hour <= night[1])) {
    if (bg.href != night) {
      bg.href = fuji;
    }
  }
}

function dynamicBatteryImg () {
  if (battery.chargeLevel > 88){ 
    batteryIcon.href = batteryFull;
  } else if (battery.chargeLevel > 62) {
    batteryIcon.href = battery75;
  } else if (battery.chargeLevel > 37) {
    batteryIcon.href = batteryHalf;
  } else if (battery.chargeLevel > 12) {
    batteryIcon.href = battery25;
  } else {
    batteryIcon.href = batteryEmpty;
  }
}

function updateStepsAndCalories() {
  if (appbit.permissions.granted("access_activity")) {
    stepCount.text = today.adjusted.steps;
    calories.text = today.adjusted.calories;
  }
}

// Init battery level display
batteryLevel.text = battery.chargeLevel + "%";


// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  let hours24 = zeroPad(hours);
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = zeroPad(hours);
  }
  let mins = zeroPad(today.getMinutes());
  dynamicImageSwitch(hours24);
  myLabel.text = `${hours}:${mins}`;
  theDate.text = `${days[today.getDay()]}, ${months[today.getMonth()]} ${today.getDate()}`;
  updateStepsAndCalories();
}

if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    heartRate.text = `${hrm.heartRate}`;
  });
  hrm.start();
}



battery.onchange = (charger, evt) => {
  if (battery.chargeLevel == 100) {
    batteryLevel.text = battery.chargeLevel;  
  } else {
    batteryLevel.text = battery.chargeLevel + "%";
  }
  
  dynamicBatteryImg();
}
