import { weatherAPI } from "./settings.js";

let dataUnit= "metric";
let location = "Sorocaba";
let date = "2022-02-01";
let dateFinal = "";
let include = "&include=days";
//"&include=alerts%2Ccurrent%2Cdays%2Cevents%2Chours";
// 97JMBZAX2DRQ96SR2QT28K7WH

export async function generateWeather() {
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date}/${dateFinal}?unitGroup=${dataUnit}${include}&key=${weatherAPI}&contentType=json`, {
        "method": "GET",
        "headers": {
        }
    })
        .then(async response => {
            console.log(await response.json());
        })
        .catch(err => {
            console.error(err);
        });
}