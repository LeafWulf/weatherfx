import { createEffect } from "./effect.js"; //import function that create the effects
import { registerSettings, cacheWfxSettings, enableSound, autoApply, enableHB } from "./settings.js"; //import settings variables and function that register those settings.
import { MODULE, MODULE_DIR, JSON_ITEM } from "./const.js";

let dnd5e = false

//Compatibility with v9
let fvttVersion
let particleWeather = 'fxmaster.updateParticleEffects'

// Hook that trigger once when the game is initiated. Register and cache settings.
Hooks.once("init", () => {
    // registerWrappers();
    checkSystem(game.system.id); //check if dnd5e
    registerSettings();
    cacheWfxSettings();
});

// Hook that triggers when the game is ready. Check if there is a weather effect been played, then check if sound is enabled and restart the sound that should be played.
Hooks.once('ready', async function () {
    fvttVersion = parseInt(game.version)
    console.log(" ====================================== ⛈ Weather FX  ====================================== ")
    console.log(" =================================== FoundryVTT Version: ", fvttVersion, " =================================== ")
    //compatibility with v9
    if (fvttVersion < 10) {
        particleWeather = 'fxmaster.updateWeather'
    }
});

Hooks.on('canvasReady', async function () {
    // console.log("🐺 ==================== canvas ready")
    if (canvas.scene.getFlag("weatherfx", "active"))
        if (enableSound)
            if (canvas.scene.getFlag("weatherfx", "audio") != "")
                AudioHelper.play({ src: canvas.scene.getFlag("weatherfx", "audio"), volume: 0.8, loop: true }, true);
})

Hooks.once('renderWeatherApplication', async function (app, html, data) {
    if (!isChatOutputOn()) {
        noChatOutputDialog()
    }
    if (game.settings.get("weatherfx", "currentWeather") == '')
        await getPrecipitation();

    // console.log("🐺 ==================== message object", data)
    // console.log("🐺 ==================== message html", html)
    // console.log("🐺 ==================== message app", app)

})

// this function should be a temporary fix. It gets the weatherData.precipitation from weather-control settings in case Weather FX doesn't have a string to use.
async function getPrecipitation() {
    let weatherData = await game.settings.get("weather-control", "weatherData").precipitation
    await game.settings.set("weatherfx", "currentWeather", weatherData)
}

// Hook on every created message, if this is a message created with the alias "Today's Weather", then trigger the Weather FX part. 
Hooks.on('createChatMessage', async function (message, html, data) {
    if (fvttVersion < 10) //compatibility with v9
        message = message.data
    if (message.speaker.alias == `Today's Weather:`) {
        // canvas.scene.setFlag("weatherfx", "currentWeather", message.content);
        await game.settings.set(MODULE, "currentWeather", message.content);
        if (autoApply)
            weatherTrigger(message.content);
    }
});

// This add the control buttons so GM can control 'clear weather effects' or 'apply weather effects'
Hooks.on("getSceneControlButtons", (controls, b, c) => {
    controls
        .find((c) => c.name == "token")
        .tools.push(
            {
                name: "clearWeather",
                title: "Clear Weather",
                icon: "fas fa-sun",
                button: true,
                visible:
                    game.user.isGM,
                //  &&
                // game.settings.get("", "enableWeatherFX"),
                onClick: () => {
                    clearEffects()
                    ChatMessage.create({ speaker: { alias: 'Weather Effects: ' }, content: "Weather effects for: " + game.settings.get("weatherfx", "currentWeather") + " <b style='color:red'>removed</b>", whisper: ChatMessage.getWhisperRecipients("GM") });
                },
            },
            {
                name: "applyWeatherFX",
                title: "Apply Weather FX",
                icon: "fas fa-cloud-sun-rain",
                button: true,
                visible:
                    game.user.isGM,
                //  &&
                // game.settings.get("", "enableWeatherFX"),
                onClick: async () => {
                    if (game.settings.get("weatherfx", "currentWeather") == '')
                        await getPrecipitation();
                    if (isChatOutputOn()) {
                        let currentWeather = game.settings.get("weatherfx", "currentWeather")
                        weatherTrigger(currentWeather);
                    }
                    else noChatOutputDialog()

                },
            }
        );
});

function isChatOutputOn() {
    let outputWeatherChat = game.settings.get('weather-control', 'outputWeatherChat')
    // let precipitation = app.weatherTracker.weatherData.precipitation
    if (!outputWeatherChat) {
        const errorMessage = "Weather FX cannot initialize and requires Weather Control 'Output weather to chat?' setting checked in order to get the current weather and apply effects to the current canvas.";
        console.error(errorMessage);
        ui.notifications.error(errorMessage);
    }
    return outputWeatherChat
}

function noChatOutputDialog() {
    new Dialog({
        title: "No weather data!",
        content: "<p>Please activate <b>Weather Control</b> output to chat, otherwise Weather FX can't access its data</p><p><br></p>",
        buttons: {
            yes: {
                icon: "<i class='fas fa-check'></i>",
                label: "Activate",
                callback: async () => {
                    await game.settings.set('weather-control', 'outputWeatherChat', true)
                    await getPrecipitation();
                    // let currentWeather = game.settings.get("weatherfx", "currentWeather")
                    // weatherTrigger(currentWeather);
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


function checkSystem(system) {
    if (system === 'dnd5e')
        dnd5e = true
}

// Trigger weather fx chain of events. 1st it transforms the whole message to lowercase so it's easier to check the cases without worrying for capital letters. 2nd start the check weather function, that checks the string for which weather was generated.
function weatherTrigger(message) {
    let msgString = message.toLowerCase();
    checkWeather(msgString);
}

// checks the string for which weather was generated, create the effect and passes it as argument for Weather Effects function.
function checkWeather(msgString) {
    if (msgString.includes('rain')) {
        if (msgString.includes('heavy') || msgString.includes('monsoon')) {
            return weatherEffects(createEffect('heavyRain'));
        }
        else if (msgString.includes('firey')) {
            return console.log('🐺******** Preciso fazer ainda: FIERY');
        }
        else if (msgString.includes('freezing')) {
            return weatherEffects(createEffect('freezingRain'));
        }
        else if (msgString.includes('torrential')) {
            return weatherEffects(createEffect('thunderstorm'));
        }
        else
            return weatherEffects(createEffect('rain'));
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
            case msgString.includes('large'): return weatherEffects(createEffect('snowFall'));
            case msgString.includes('light'): return weatherEffects(createEffect('lightSnow'));
        }
    }
    else if (msgString.includes('flooding'))
        return weatherEffects(createEffect('thunderstorm'));

    else if (msgString.includes('blizzard'))
        return weatherEffects(createEffect('blizzard'));

    else if (msgString.includes('clear sky'))
        return weatherEffects(createEffect('clearSky'));

    else if (msgString.includes('dark'))
        return weatherEffects(createEffect('darkSky'));

    else if (msgString.includes('scattered clouds'))
        return weatherEffects(createEffect('scatteredClouds'));

    else if (msgString.includes('sun') || msgString.includes('volcano'))
        return weatherEffects(createEffect('sunAsh'));

    else if (msgString.includes('ashfall') || msgString.includes('ashen'))
        return weatherEffects(createEffect('ashfall'));

    else if (msgString.includes('drought'))
        return weatherEffects(createEffect('drought'));

    else if (msgString.includes('hail'))
        return weatherEffects(createEffect('hailStorm'));
}

// This function apply weather effects to the canvas, but first cleans any effects that are currently applied.
function weatherEffects(effectCondition) {
    clearEffects();
    canvas.scene.setFlag("weatherfx", "active", true);

    if (effectCondition.effectsArray.length > 0)
        Hooks.call(particleWeather, effectCondition.effectsArray)

    if (effectCondition.filtersArray.length > 0) {
        FXMASTER.filters.setFilters(effectCondition.filtersArray)
    }

    if (enableSound) {
        canvas.scene.setFlag("weatherfx", "audio", effectCondition.sound);
        if (effectCondition.hasSound) {
            AudioHelper.play({ src: effectCondition.sound, volume: 0.8, loop: true }, true);
        }
    }

    if (effectCondition.type == '' || !dnd5e || !enableHB)
        return;
    else
        return weatherRoll(effectCondition.type);
}

// roll to the chat the conditions, dnd 5e homebrew
async function weatherRoll(item) {
    // item.use();
    let weatherArray = await jsonItem();
    let weather = weatherArray.find(i => i.name === item)
    let saveButton = ''
    if (weather.save.dc != null) {
        saveButton = `<div class="card-buttons">
                    <button data-action="save" data-ability=${weather.save.ability}>
                    Saving Throw DC ${weather.save.dc} ${weather.save.ability}
                    </button></div>`
    }
    let msgContent = `<div class="dnd5e chat-card item-card"><header class="card-header flexrow">
                    <img src='${MODULE_DIR}/${weather.img}' title=${weather.name} width="36" height="36">
                    <h3 class="item-name">${weather.name}</h3></header>
                    <div class="card-content">${weather.description}</div>
                    ${saveButton}<footer class="card-footer"></footer></div>`
    ChatMessage.create({
        speaker: { alias: 'Weather Effects: ' }, content: msgContent,
        whisper: ChatMessage.getWhisperRecipients("GM")
    })
}

// Read the json weather 'item' file.
async function jsonItem() {
    let file = await fetch(JSON_ITEM);
    let array = await file.json();
    return array;
}

// remove all the current fx on the canvas, also stops all the sounds effects that matches the flag weatherfx.audio
function clearEffects() {
    canvas.scene.setFlag("weatherfx", "active", false);
    let src = canvas.scene.getFlag("weatherfx", "audio");
    Hooks.call(particleWeather, []);
    FXMASTER.filters.setFilters([]);
    for (let [key, sound] of game.audio.playing) {
        if (sound.src !== src) continue;
        sound.stop();
    }
}