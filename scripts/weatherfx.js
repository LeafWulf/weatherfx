import { MODULE, playlistName } from "./const.js";
import { getKeyByVal } from "./util.js"
import { registerSettings, cacheSettings, enableSound, autoApply, instantApply, enableHB, blizzardSound, rainSound, heavyRainSound, thunderstormSound, weatherSource, currentWeather } from "./settings.js"; //import settings variables and function that register those settings.
import { createEffect } from "./effect.js"; //import function that create the effects
import { generatePlaylist, addSound } from "./playlist.js"
import { firstTime } from "./patchPlaylist.js";
import { weatherRoll } from "./weather-conditions.js"
import { smallWeatherString } from "./sw-fn.js"
import { getPrecipitation, toggleWeatherControl, isChatOutputOn, noChatOutputDialog, weatherControlHooks, checkWeather } from "./wc-fn.js"

let dnd5e = false
export let lang

//Compatibility with v9
export let fvttVersion
export let particleWeather = 'fxmaster.updateParticleEffects'

// Hook that trigger once when the game is initiated. Register and cache settings.
Hooks.once("init", () => {
    // registerWrappers();
    checkSystem(game.system.id); //check if dnd5e
    registerSettings();
    cacheSettings();
});

// Hook that triggers when the game is ready. Check if there is a weather effect been played, then check if sound is enabled and restart the sound that should be played.
Hooks.once('ready', async function () {
    fvttVersion = parseInt(game.version)
    lang = game.i18n.lang
    console.log(" ======================================== ⛈ Weather FX  ======================================== ")
    console.log(" =================================== FoundryVTT Version: ", fvttVersion, " =================================== ")
    //compatibility with v9
    if (fvttVersion < 10) {
        particleWeather = 'fxmaster.updateWeather'
    }
    await weatherControlHooks();
    await weatherfxPlaylistExists();
});

Hooks.on('ready', async function () {
    game.socket.on('module.weatherfx', async (data) => {
        await doSocket(data);
    });
});

Hooks.on('canvasReady', async function () {
    const thisScene = game.scenes.viewed
    defaultAutoApplyFlag(thisScene)
    if (await canvas.scene.getFlag("weatherfx", "active") !== undefined || await canvas.scene.getFlag("weatherfx", "audio") || await canvas.scene.getFlag("weatherfx", "currentWeather"))
        await firstTime();
})

Hooks.on('renderSceneConfig', async (app, html) => {
    defaultAutoApplyFlag(app.object);
    const autoapplyCheckStatus = app.object.getFlag('weatherfx', 'auto-apply') ? 'checked' : '';
    const injection = `
    <hr>
    <style> .wfx-scene-config {
        border: 1px solid #999;
        border-radius: 8px;
        margin: 8px 0;
        padding: 0 15px 5px 15px;
    }</style>
    <fieldset class="wfx-scene-config">
      <legend> <i class="fas fa-cloud-sun"></i><span>Weather FX</span> </legend>
      <div class="form-group">
        <label>Auto Apply</label>
        <input
          type="checkbox"
          name="flags.weatherfx.auto-apply"
          ${autoapplyCheckStatus}>
        <p class="notes">Toggle auto-apply weather effects to the scene.</p>
      </div>
    </fieldset>`;
    const weatherEffect = html.find('select[name="weather"]');
    const formGroup = weatherEffect.closest(".form-group");
    formGroup.after(injection);
    app.setPosition({ height: "auto" });
})

Hooks.on('smallweatherUpdate', async function (weather, hourly) {
    // await game.settings.set(MODULE, "currentWeather", currentWeather)
    // cacheSettings();
    let sceneAutoApply = game.scenes.viewed.getFlag('weatherfx', 'auto-apply') ? true : false;
    if (autoApply && sceneAutoApply) await smallWeatherString(weather, hourly)
    await game.settings.set(MODULE, 'currentWeather', weather)
})

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
                    if (weatherSource === 'smallweather')
                        ChatMessage.create({ speaker: { alias: 'Weather FX: ' }, content: "Weather effects for: " + game.settings.get("weatherfx", "currentWeather").conditions + " <b style='color:red'>removed</b>", whisper: ChatMessage.getWhisperRecipients("GM") });
                    else
                        ChatMessage.create({ speaker: { alias: 'Weather FX: ' }, content: "Weather effects for: " + game.settings.get("weatherfx", "currentWeather") + " <b style='color:red'>removed</b>", whisper: ChatMessage.getWhisperRecipients("GM") });
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
                    if (weatherSource === 'weather-control' && game.modules.get('weather-control').active) {
                        if (!game.settings.get("weatherfx", "currentWeather"))
                            await getPrecipitation();
                        if (isChatOutputOn()) {
                            let currentWeather = game.settings.get("weatherfx", "currentWeather")
                            checkWeather(currentWeather)
                        }
                        else noChatOutputDialog()
                    } else if (weatherSource === 'smallweather' && game.modules.get('smallweather').active) {
                        await smallWeatherString(currentWeather)
                    }
                },
            }
        );
    if (game.modules.get('weather-control').active)
        controls
            .find((c) => c.name == "notes")
            .tools.push({
                name: "toggle-weatherApp",
                title: "Toggle Weather Control",
                icon: "fas fa-cloud-sun",
                button: true,
                visible: game.user.isGM,
                onClick: () => {
                    toggleWeatherControl()
                },
            });
});

function defaultAutoApplyFlag(scene) {
    if (!hasProperty(scene, 'data.flags.weatherfx.auto-apply')) {
        scene.setFlag('weatherfx', 'auto-apply', autoApply);
    }
}

function checkSystem(system) {
    if (system === 'dnd5e')
        dnd5e = true
}

// This function apply weather effects to the canvas, but first cleans any effects that are currently applied.
export async function weatherEffects(effectCondition) {
    if (canvas.scene.getFlag("weatherfx", "isActive") !== undefined)
        await clearEffects();

    await canvas.scene.setFlag("weatherfx", "isActive", true);
    await canvas.scene.setFlag("weatherfx", "effectCondition", effectCondition);

    if (effectCondition.effectsArray.length > 0)
        Hooks.call(particleWeather, effectCondition.effectsArray)

    if (effectCondition.filtersArray.length > 0) {
        FXMASTER.filters.setFilters(effectCondition.filtersArray)
    }

    if (enableSound && effectCondition.hasSound) {
        let playlist = game.playlists.getName(playlistName);
        let sound = playlist.sounds.getName(effectCondition.soundName);
        playlist.playSound(sound);
    }
    if (instantApply) await instantWeather();

    if (effectCondition.type == '' || !dnd5e || !enableHB)
        return;
    else
        return weatherRoll(effectCondition.type);
}

// remove all the current fx on the canvas, also stops all the sounds effects that matches the flag weatherfx.audio
async function clearEffects() {
    await canvas.scene.setFlag("weatherfx", "isActive", false);
    let effectCondition = canvas.scene.getFlag("weatherfx", "effectCondition");
    Hooks.call(particleWeather, []);
    FXMASTER.filters.setFilters([]);
    if (enableSound && effectCondition.hasSound) {
        let playlist = game.playlists.getName(playlistName);
        let sound = playlist.sounds.getName(effectCondition.soundName);
        if (sound) if (sound.playing) {
            playlist.stopSound(sound);
        }
    }
    if (instantApply) await instantWeather();
}

async function weatherfxPlaylistExists() {
    let playlist = game.playlists?.contents.find((p) => p.name === playlistName);
    let playlistExists = playlist ? true : false;
    if (!playlistExists) await weatherfxPlaylist(playlistName);
}

export async function weatherfxPlaylist(playlistName) {
    await generatePlaylist(playlistName);
    await addSound('blizzard', blizzardSound);
    await addSound('rain', rainSound);
    await addSound('heavyRain', heavyRainSound);
    await addSound('thunderstorm', thunderstormSound);
}

// Helper function for handling sockets.
function emitSocket(type, payload) {
    game.socket.emit('module.weatherfx', {
        type: type,
        payload: payload,
    });
}
async function doSocket(data) {
    if (data.type === 'instantWeather') {
        await instantWeatherPlayer();
    }
}
async function instantWeatherPlayer() {
    await canvas.draw()
}
async function instantWeather() {
    await new Promise(resolve => setTimeout(resolve, 800));
    await canvas.draw()
    emitSocket('instantWeather');
}