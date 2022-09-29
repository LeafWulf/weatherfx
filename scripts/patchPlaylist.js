import { particleWeather, getPrecipitation, checkWeather, noChatOutputDialog, isChatOutputOn, weatherfxPlaylist } from "./weatherfx.js"
import { MODULE, playlistName } from "./const.js";

export async function firstTime() {
    Hooks.call(particleWeather, []);
    FXMASTER.filters.setFilters([]);
    if (canvas.scene.getFlag("weatherfx", "audio") !== undefined) {
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
    await getPrecipitation();
    firstTimeDialog();
}

function firstTimeDialog() {
    new Dialog({
        title: "Version 1.2.0",
        content: "<p>Weather FX v1.2.0 now uses built in playlist API, it now uses a playlist called 'Weather FX Playlist' with all the SFX you had configured before.</p><p>This is better because you now have more options like set volume and fade in/out duration.</p><p>Please never change the playlist name nor the songs names, although you can change the sound path to whichever you prefer.</p><p>The weather effects that were playing in this scene got removed because of this change. You can reapply it by clicking the 'OK' button</p>",
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
            }
        },
        default: "yes",
    }).render(true);
}