import { createEffect } from "./effect.js";
import { registerSettings, cacheWfxSettings, enableSound, autoApply } from "./settings.js";
import { weatherRoll } from "./util.js"


function weatherEffects(effectCondition) {
    clearEffects();
    canvas.scene.setFlag("weatherfx", "active", "true");

    if (effectCondition.effectsArray.length > 0)
        Hooks.call('fxmaster.updateParticleEffects', effectCondition.effectsArray)

    if (effectCondition.filtersArray.length > 0) {
        FXMASTER.filters.setFilters(effectCondition.filtersArray)
    }

    if (enableSound) {
        canvas.scene.setFlag("weatherfx", "audio", effectCondition.sound);
        if (effectCondition.hasSound) {
            AudioHelper.play({ src: effectCondition.sound, volume: 0.8, loop: true }, true);
        }
    }

    if (effectCondition.type == '')
        return;
    else
        return weatherRoll(effectCondition.type);
}

function clearEffects() {
    canvas.scene.setFlag("weatherfx", "active", "false");
    let src = canvas.scene.getFlag("weatherfx", "audio");
    Hooks.call('fxmaster.updateParticleEffects', []);
    FXMASTER.filters.setFilters([]);
    for (let [key, sound] of game.audio.playing) {
        if (sound.src !== src) continue;
        sound.stop();
    }
}

function weatherTrigger(message) {
    let msgString = message.toLowerCase();
    checkWeather(msgString);
}

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

Hooks.once("init", () => {
    // registerWrappers();
    registerSettings();
    cacheWfxSettings();
});

Hooks.once('ready', async function () {
    if (canvas.scene.getFlag("weatherfx", "active"))
        if (enableSound)
            if (canvas.scene.getFlag("weatherfx", "audio") != "")
                AudioHelper.play({ src: canvas.scene.getFlag("weatherfx", "audio"), volume: 0.8, loop: true }, true);
});

Hooks.on('createChatMessage', async function (message) {
    if (message.speaker.alias == `Today's Weather:`) {
        canvas.scene.setFlag("weatherfx", "currentWeather", message.content);
        if (autoApply)
            weatherTrigger(message.content);
    }
});

Hooks.on("getSceneControlButtons", (controls, b, c) => {
    controls
        .find((c) => c.name == "token")
        .tools.push(
            {
                name: "clearWeather",
                title: "Clear Weather",
                icon: "fas fa-cloud-slash",
                button: true,
                visible:
                    game.user.isGM,
                //  &&
                // game.settings.get("", "enableWeatherFX"),
                onClick: () => {
                    clearEffects()
                    ChatMessage.create({ speaker: { alias: 'Weather Effects: ' }, content: "Weather effects for: " + canvas.scene.getFlag("weatherfx", "currentWeather") + " removed", whisper: ChatMessage.getWhisperRecipients("GM") });
                },
            },
            {
                name: "applyWeatherFX",
                title: "Apply Weather FX",
                icon: "fas fa-cloud",
                button: true,
                visible:
                    game.user.isGM,
                //  &&
                // game.settings.get("", "enableWeatherFX"),
                onClick: () => {
                    let currentWeather = canvas.scene.getFlag("weatherfx", "currentWeather")
                    weatherTrigger(currentWeather);
                },
            }
        );
});