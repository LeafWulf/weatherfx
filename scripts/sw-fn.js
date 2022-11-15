import { MODULE } from "./const.js";
import { cacheSettings, currentWeather, weatherSource, debug } from "./settings.js";
import { weatherEffects } from "./weatherfx.js";
import { createEffect } from "./effect.js"

export async function smallWeatherString(weather, hourly) {
    if (JSON.stringify(weather) === JSON.stringify(game.settings.get(weatherSource, 'currentWeather'))) {
        await checkWeatherSW(weather.effect)
        cacheSettings();
    }
    else if (debug) console.error("current weather doesn't match with SmallWeather. ", weather, game.settings.get(weatherSource, 'currentWeather'))
}

export async function checkWeatherSW(effectName) {
    effectName.forEach(async (element) => {
        await weatherEffects(createEffect(element));
    });
}
