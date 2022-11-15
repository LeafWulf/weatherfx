import { MODULE, playlistName } from "./const.js";
import { particleWeather, weatherfxPlaylist } from "./weatherfx.js"
import { getPrecipitation, isChatOutputOn, noChatOutputDialog, checkWeather } from "./wc-fn.js"

export async function firstTime() {
    Hooks.call(particleWeather, []);
    FXMASTER.filters.setFilters([]);
    if (canvas.scene.getFlag("weatherfx", "audio")) {
        let src = canvas.scene.getFlag("weatherfx", "audio");
        if (canvas.scene.getFlag("weatherfx", "active"))
            for (let [key, sound] of game.audio.playing) {
                if (sound.src !== src) continue;
                sound.stop();
            }
    }
    await canvas.scene.unsetFlag("weatherfx", "audio");
    await canvas.scene.unsetFlag("weatherfx", "active");
    await canvas.scene.unsetFlag("weatherfx", "currentWeather");
    firstTimeDialog();
}

function firstTimeDialog() {
    new Dialog({
        title: "Version 1.2.0",
        content: `<p><b>Weather FX v1.2.0</b> now uses built in playlist API, it created a playlist called <b>'${playlistName}'</b> with all the SFX you had configured before. This is better because you now have more options like set volume and fade in/out duration.<p>Please never change the playlist name nor the songs names. However, you can change the sounds path to whichever you like.</p><p>The weather effects that were playing in this scene got removed because of this change. You can reapply it by clicking the 'OK' button.</p>`,
        buttons: {
            yes: {
                icon: "<i class='fas fa-check'></i>",
                label: "OK",
                callback: async () => {
                    if (game.settings.get("weatherfx", "currentWeather") == '')
                        await getPrecipitation();
                    if (isChatOutputOn()) {
                        let currentWeather = game.settings.get("weatherfx", "currentWeather")
                        checkWeather(currentWeather)
                    }
                    else noChatOutputDialog()
                }
            },
            close: {
                icon: "<i class='fas fa-times'></i>",
                label: "Close",
                callback: async () => {
                    return
                }
            },
        },
        default: "yes",
    }).render(true);
}
