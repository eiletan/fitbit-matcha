import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import { me as appbit } from "appbit";
import { HeartRateSensor } from "heart-rate";

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

// Get a handle for the <image> element which is used as the background image
const bg = document.getElementById("background-img");

// Get a handle for the <text> element which is used to display heart rate
const heartRate = document.getElementById("heartRate");

// Time ranges for images
let morning = [6, 11];
let afternoon = [12, 17];
let evening = [18, 21];
let night= [22, 5];

// Images
let shibuya ="shibuya-crossing.jpg";
let fuji = "mt-fuji.jpg";
let ninenzaka ="ninenzaka.jpg";
let shinkansen = "bullet-train-mt-fuji.jpg";

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
}

if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    heartRate.text = `\u2665${hrm.heartRate}`;
  });
  hrm.start();
}