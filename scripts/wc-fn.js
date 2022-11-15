import { MODULE, i18nTodaysWeather } from "./const.js";
import { removeTemperature, getKeyByVal } from "./util.js"
import { toggleApp, weatherSource, autoApply } from "./settings.js"
import { lang, fvttVersion, weatherEffects } from "./weatherfx.js";
import { createEffect } from "./effect.js"

export async function weatherControlHooks() {
    if (game.modules.get('weather-control').active) {
        Hooks.on('renderT', async function (app, html, data) {
            if (weatherSource === 'weather-control') {
                if (!isChatOutputOn()) {
                    noChatOutputDialog();
                }
                if (!game.settings.get("weatherfx", "currentWeather"))
                    await getPrecipitation();
            }
        })

        // Hook on every created message, if this is a message created with the alias "Today's Weather", then trigger the Weather FX part. 
        Hooks.on('createChatMessage', async function (message) {
            if (weatherSource === 'weather-control') {
                let todaysWeather = await langJson()
                todaysWeather = todaysWeather[i18nTodaysWeather]
                let sceneAutoApply = game.scenes.viewed.getFlag('weatherfx', 'auto-apply') ? true : false;
                if (fvttVersion < 10) //compatibility with v9
                    message = message.data
                if (message.speaker.alias == todaysWeather) {
                    let precipitation = removeTemperature(message.content)
                    await game.settings.set(MODULE, "currentWeather", precipitation);
                    if (autoApply & sceneAutoApply)
                        checkWeather(precipitation)
                }
            }
        });
    }
}

// this function should be a temporary fix. It gets the weatherData.precipitation from weather-control settings in case Weather FX doesn't have a string to use.
export async function getPrecipitation() {
    let weatherData = await game.settings.get("weather-control", "weatherData").precipitation
    await game.settings.set("weatherfx", "currentWeather", weatherData)
    return weatherData
}

export function toggleWeatherControl() {
    const defaultPosition = { top: 100 * toggleApp, left: 100 * toggleApp };
    game.settings.set("weatherfx", "toggleApp", toggleApp * -1)
    const element = document.getElementById('weather-control-container');
    if (element) {
        element.style.top = defaultPosition.top + 'px';
        element.style.left = defaultPosition.left + 'px';
        element.style.bottom = null;
    }
}

export function isChatOutputOn() {
    let outputWeatherChat = game.settings.get('weather-control', 'outputWeatherChat')
    // let precipitation = app.weatherTracker.weatherData.precipitation
    if (!outputWeatherChat) {
        const errorMessage = "Weather FX cannot initialize and requires Weather Control 'Output weather to chat?' setting checked in order to get the current weather and apply effects to the current canvas.";
        console.error(errorMessage);
        ui.notifications.error(errorMessage);
    }
    return outputWeatherChat
}

export function noChatOutputDialog() {
    new Dialog({
        title: "No weather data!",
        content: "<p>Please activate <b>Weather Control</b> output to chat, otherwise Weather FX can't access its data</p>",
        buttons: {
            yes: {
                icon: "<i class='fas fa-check'></i>",
                label: "Activate",
                callback: async () => {
                    await game.settings.set('weather-control', 'outputWeatherChat', true)
                    await getPrecipitation();
                }
            },
            no: {
                icon: "<i class='fas fa-times'></i>",
                label: "No, I won't",
                callback: async () => {
                    return
                }
            },
        },
        default: "yes",
    }).render(true);
}

export async function langJson(language = lang) {
    let file = await fetch(`modules/weather-control/lang/${language}.json`);
    let json = await file.json();
    return json;
}

// checks the string for which weather was generated, create the effect and passes it as argument for Weather Effects function.
export async function checkWeather(msgString) {

    if (weatherSource === 'weather-control') {
        // msgString = await game.settings.get("weatherfx", "currentWeather") //improve this later
        let weatherObject = await langJson();
        let comparableString = await getKeyByVal(weatherObject, msgString)
        let enJson = await langJson("en")
        msgString = enJson[comparableString].toLowerCase()
    } else {
        msgString = msgString.toLowerCase()
    }

    if (msgString.includes('rain')) {
        if (msgString.includes('heavy') || msgString.includes('monsoon')) {
            return weatherEffects(createEffect('heavyRain'));
        }
        else if (msgString.includes('firey')) {
            return console.log('🐺******** Preciso fazer ainda: FIERY');
        }
        else if (msgString.includes('freezing')) {
            return weatherEffects(createEffect('moderateFreezingRain'));
        }
        else if (msgString.includes('torrential')) {
            return weatherEffects(createEffect('thunderstorm'));
        }
        else
            return weatherEffects(createEffect('moderateRain'));
    }

    else if (msgString.includes('overcast')) {
        switch (true) {
            case msgString.includes('freezing'): return weatherEffects(createEffect('overcastFreezing'));
            case msgString.includes('drizzles'): return weatherEffects(createEffect('overcastDrizzle'));
            case msgString.includes('snow'): return weatherEffects(createEffect('overcastSnow'));
        }
    }
    else if (msgString.includes('snow')) {
        switch (true) {
            case msgString.includes('large'): return weatherEffects(createEffect('moderateSnow'));
            case msgString.includes('light'): return weatherEffects(createEffect('lightSnow'));
        }
    }
    else if (msgString.includes('flooding'))
        return weatherEffects(createEffect('thunderstorm'));

    else if (msgString.includes('blizzard'))
        return weatherEffects(createEffect('blizzard'));

    else if (msgString.includes('clear sky'))
        return weatherEffects(createEffect('clear'));

    else if (msgString.includes('dark'))
        return weatherEffects(createEffect('darkSky'));

    else if (msgString.includes('scattered clouds'))
        return weatherEffects(createEffect('partlyCloudy'));

    else if (msgString.includes('sun') || msgString.includes('volcano'))
        return weatherEffects(createEffect('sunAsh'));

    else if (msgString.includes('ashfall') || msgString.includes('ashen'))
        return weatherEffects(createEffect('ashfall'));

    else if (msgString.includes('drought'))
        return weatherEffects(createEffect('drought'));

    else if (msgString.includes('hail'))
        return weatherEffects(createEffect('hailStorm'));
}

