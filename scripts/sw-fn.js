import { MODULE } from "./const.js";
import { cacheSettings, currentWeather, weatherSource, debug, topDownRain } from "./settings.js";
import { weatherEffects } from "./weatherfx.js";
import { createEffect, Effect } from "./effect.js"

export async function smallWeatherString(weather, hourly) {
    if (JSON.stringify(weather) === JSON.stringify(game.settings.get(weatherSource, 'currentWeather'))) {
        // await checkWeatherSW(weather.effect) //hopefully wont need anymore with smallweather
        await createWeatherEffect(weather)
        cacheSettings();
    }
    else if (debug) console.error("current weather doesn't match with SmallWeather. ", weather, game.settings.get(weatherSource, 'currentWeather'))
}

export async function checkWeatherSW(effectName) {
    effectName.forEach(async (element) => {
        await weatherEffects(createEffect(element));
    });
}

async function createWeatherEffect(weather) {
    const effectName = weather.weatherStr
    const precipitation = inToMm(weather.precip)
    const isSnow = weather.effect.some(str => str === "lightSnow" || str === "moderateSnow" || str === "heavySnow" || str === "blizzard");
    let soundName = '', hasSound = false, particles = [], filters = [], rainScale, rainSpeed = 1

    if (precipitation >= 2) {
        hasSound = true;
        if (precipitation < 7.5) {
            if (isSnow)
                hasSound = false
            else
                soundName = 'rain'
        }
        else if (precipitation <= 16) {
            if (isSnow)
                hasSound = false
            else
                soundName = 'heavyRain'
        }
        else {
            if (isSnow)
                soundName = 'blizzard'
            else
                soundName = 'thunderstorm'
        }
    }

    const clouds = {
        "type": "clouds", "options": {
            "scale": 1, //((game.scenes.current.width * 0.000576923) + 0.476923).toFixed(3), // min 0.1 max 5
            "direction": parseInt(adjustAngle(weather.winddir - 90)),
            "speed": convertWindSpeed(weather.windspeed).toFixed(2), // 0.1 to 5
            "lifetime": 1, //
            "density": ((weather.cloudcover) / 1000).toFixed(3), // from 0.001 to 0.2
            "tint": { "apply": true, "value": cloudColor(weather.cloudcover, precipitation) }
        }
    }
    const overcast = {
        "type": "color", "options": {
            "color": { "apply": true, "value": "#d1d1d1" },
            "saturation": 0.8,
            "contrast": 1,
            "brightness": 0.9,
            "gamma": 1,
            "red": 0.8196078431372549, "green": 0.8196078431372549, "blue": 0.8196078431372549
        }
    }

    particles.push(clouds)
    if (weather.cloudcover > 90)
        filters.push(overcast)

    if (precipitation <= 4) {
        rainScale = (precipitation / 2)
    }
    else {
        rainScale = ((precipitation / 40) + 2)
        rainSpeed = ((precipitation / 40) + 1)
        if (precipitation >= 7.5 && weather.temp >= 68)
            if (weather.humidity >= 70 || weather.windspeed >= 75) {
                const lightning = {
                    "type": "lightning",
                    "options": {
                        "frequency": 1000,
                        "spark_duration": 500,
                        "brightness": 1.3
                    }
                }
                filters.push(lightning)
            }
        const rainMist = { "type": "fog", "options": { "dimensions": 0.3, "speed": 1, "density": 0.2, "color": { "apply": false, "value": "#000000" } } }
        if (!isSnow)
            filters.push(rainMist)
    }

    const rainTopDown = {
        "type": "raintop", "options": {
            "scale": (rainScale + 0.1).toFixed(2), // this is the main variable
            "speed": rainSpeed.toFixed(2), // this might change for stronger rains
            "lifetime": 0.9,
            "density": 1,
            "tint": { "apply": false, "value": "#ffffff" }
        }
    }
    const rain = {
        "type": "rain", "options": {
            "scale": (rainScale + 0.1).toFixed(2),
            "direction": rainAngle(adjustAngle(weather.winddir - 90)),
            "speed": rainSpeed.toFixed(2),
            "lifetime": 1,
            "density": 1,
            "tint": { "apply": false, "value": "#ffffff" }
        }
    }
    const snowFlake = {
        "type": "snow", "options": {
            "scale": 1,
            "direction": parseInt(adjustAngle(weather.winddir - 90)),
            "speed": convertWindSpeed(weather.windspeed).toFixed(2), // força do vento
            "lifetime": 0.1,
            "density": (rainScale).toFixed(2) / 10, // quantidade de neve
            "tint": { "apply": false, "value": "#ffffff" }
        }
    }
    const snow = {
        "type": "snowstorm", "options": {
            "scale": 0.5,
            "direction": parseInt(adjustAngle(weather.winddir - 90)),
            "speed": convertWindSpeed(weather.windspeed).toFixed(2),
            "lifetime": 0.1, // (1 / (rainScale)).toFixed(2),
            "density": (rainScale).toFixed(2) / 10,
            "tint": { "apply": false, "value": "#ffffff" }
        }
    }
    const coldClimate = {
        "type": "color", "options": {
            "color": { "apply": true, "value": "#bef3ef" },
            "saturation": 1,
            "contrast": 1,
            "brightness": 1,
            "gamma": 1
        }
    }

    if (precipitation > 0)
        if (!isSnow) {
            if (topDownRain)
                particles.push(rainTopDown)
            else
                particles.push(rain)
        }
        else particles.push(snow, snowFlake, coldClimate)

    /*
    - Light rain: Light rain is a type of precipitation that typically falls at a rate of 0.1 - 0.5 mm / h or 0.004 - 0.020 in /h. This type of rain is generally considered to be very light and is often not even noticeable.
    - Moderate rain: Moderate rain is a type of precipitation that typically falls at a rate of 0.5 - 4.0 mm / h or 0.020 - 0.157 in /h. This type of rain is generally considered to be moderate in intensity and can be easily noticed.
    - Heavy rain: Heavy rain is a type of precipitation that typically falls at a rate of 4.0 - 16.0 mm / h or 0.157 - 0.630 in /h. This type of rain is generally considered to be heavy in intensity and can be difficult to walk through or drive in.
    - Intense rain: Intense rain is a type of precipitation that typically falls at a rate of 16.0 - 50.0 mm / h or 0.630 - 1.97 in /h. This type of rain is generally considered to be very heavy and can cause flooding or other problems.
    *//*
    - Light snow: Light snow is a type of precipitation that typically falls at a rate of 0.1-2.5 mm/h. This type of snow is generally considered to be very light and is often not even noticeable.
    - Moderate snow: Moderate snow is a type of precipitation that typically falls at a rate of 2.5-7.5 mm/h. This type of snow is generally considered to be moderate in intensity and can be easily noticed.
    - Heavy snow: Heavy snow is a type of precipitation that typically falls at a rate of 7.5-15.0 mm/h. This type of snow is generally considered to be heavy in intensity and can be difficult to walk through or drive in.
    - Intense snow: Intense snow is a type of precipitation that typically falls at a rate of 15.0-30.0 mm/h. This type of snow is generally considered to be very heavy and can cause significant problems such as road closures and power outages.
    */

    let effectCondition = new Effect(effectName, effectName, hasSound, soundName, soundName, particles, filters)

    await weatherEffects(effectCondition)

}

function adjustAngle(angle) {
    // adjust angle to be within 0 to 360 range
    angle = angle % 360;
    if (angle < 0) {
        angle += 360;
    }
    return angle;
}

function convertWindSpeed(input) {
    return (input / 30) + 0.1;
}

function cloudColor(cloudCover, precip) {
    if (cloudCover > 90 || precip >= 2)
        return "#B6B6B4"
    else return "#ffffff"
}

function inToMm(number) {
    return number * 25.4
}

function rainAngle(deg) {
    deg = deg % 180
    let a = (deg % 90) / 90
    let b = Math.sin(degToRad(deg))

    if (a === 0)
        return parseInt(90 + a)
    else
        return parseInt(90 + (45 * b))
}

function degToRad(deg) {
    return deg * (Math.PI / 180)
}