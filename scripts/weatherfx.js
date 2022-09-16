import { createEffect } from "./effect.js";
import { registerSettings, cacheWfxSettings, enableSound, customSound, blizzardSound, rainSound, thunderstormSound, heavyRainSound, applyWeatherTo } from "./settings.js";

function weatherEffects(effectCondition) {
    let item = game.actors.getName('Weather Effects').items.find(i => i.name === effectCondition.type)

    clearEffects();

    if (effectCondition.effectsArray.length > 0)
        Hooks.call('fxmaster.updateParticleEffects', effectCondition.effectsArray)

    if (effectCondition.filtersArray.length > 0) {
        FXMASTER.filters.setFilters(effectCondition.filtersArray)
    }

    if (enableSound) {
        if (effectCondition.hasSound) {
            AudioHelper.play({ src: effectCondition.sound, volume: 0.8, loop: true }, true);
            canvas.scene.setFlag("weatherfx", "audio", effectCondition.sound);
        }

    }

    if (effectCondition.type == '')
        return;
    else
        return weatherRoll(item);
}

function clearEffects() {
    let src = canvas.scene.getFlag("weatherfx", "audio");
    Hooks.call('fxmaster.updateParticleEffects', []);
    FXMASTER.filters.setFilters([]);
    for (let [key, sound] of game.audio.playing) {
        if (sound.src !== src) continue;
        sound.stop();
    }
}

function weatherRoll(item) {
    item.use();
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
            case msgString.includes('Large amount'): return weatherEffects(createEffect('snowFall'));
            case msgString.includes('A light to moderate'): return weatherEffects(createEffect('lightSnow'));
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
}

Hooks.once("init", () => {
    // registerWrappers();
    registerSettings();
    cacheWfxSettings();
});

Hooks.once('ready', async function () {
    console.log('🐺 ==== hook ready')
});

Hooks.on('createChatMessage', async function (message) {
    let msgString = message.content.toLowerCase();
    if (message.speaker.alias == `Today's Weather:`) {
        checkWeather(msgString);     
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
                    let currentWeather = game.messages.filter(i => i.alias == `Today's Weather:`).sort((a, b) => b.data.timestamp - a.data.timestamp)[0].content.toLowerCase();
                    checkWeather(currentWeather); 
                },
            }
        );
});