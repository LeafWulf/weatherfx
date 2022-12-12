import { MODULE } from "./const.js"

export let toggleApp = null;
export let autoApply = true;
export let enableHB = true;
export let enableSound = false;
export let currentWeather = null
export let debug = false

export let topDownRain = true
export let instantApply = false

export let weatherSource = 'weather-control'

export let blizzardSound = 'modules/michaelghelfi/ambience/Snowing.ogg';
export let rainSound = 'modules/ivan-duch-music-packs/audio/rain-sfx.ogg';
export let thunderstormSound  = 'modules/michaelghelfi/ambience/RainandThunder.ogg';
export let heavyRainSound = 'modules/ivan-duch-music-packs/audio/rain-sfx.ogg';

export function registerSettings() {
    game.settings.register(MODULE, 'weatherSource', {
        name: 'Weather Source',
        hint: 'Choose which module should Weather FX watch in order to generate screen effects.',
        scope: 'world',
        config: true,
        type: String,
        choices: {
            "smallweather": "SmallWeather",
            "weather-control": "Weather Control"
        },
        default: weatherSource,
        restricted: true,
        onChange: () => {
            let thisSetting = game.settings.get(MODULE, 'weatherSource');
            if (game.modules.get(thisSetting).active)
            cacheSettings(); //preciso arrumar aqui pra mostrar um dialogo para o usuario quando ele escolhe um modulo que nao esta ativo, mas agora nao da tempo.
            // else alert ('you must activate', thisSetting)
        },
    });

    game.settings.register(MODULE, 'instantApply', {
        name: 'Instant Apply',
        hint: `If checked the module will instantly apply the new weather, meaning it will reload the current scene so you won't have to wait the transitions between different weathers.`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: instantApply,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'autoApply', {
        name: 'Automatic Apply',
        hint: `Check this option if you would like to have weather effects automatic applied to the current scene.`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'topDownRain', {
        name: 'Top-Down Rain',
        hint: `Check this option if you would like to use top-down rain, otherwise the module will apply Foundry's default rain effect. This works only with smallweather at the momemnt.`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: topDownRain,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'enableHB', {
        name: 'D&D 5e Weather Conditions',
        hint: `Get Weather FX to roll weather conditions to the chat.`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'enableSound', {
        name: 'Enable Sound',
        hint: `Play sound effects along with the visual weather effects (The default are sounds from the modules: Ivan Duch's Music Packs and Michael Ghelfi Studios Audio Pack, so you would need to install these modules as well or set your own custom sounds).`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });
// remove the next 4 settings in the future, these were kept only so it don't break anything.
    game.settings.register(MODULE, 'blizzardSound', {
        name: 'Custom sounds effects: Blizzard',
        hint: 'Let you change the sounds effects for whatever you prefer.',
        scope: 'world',
        config: false,
        type: String,
        filePicker: 'audio',
        default: blizzardSound,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'rainSound', {
        name: 'Custom sounds effects: Rain',
        hint: 'Let you change the sounds effects for whatever you prefer.',
        scope: 'world',
        config: false,
        type: String,
        filePicker: 'audio',
        default: rainSound,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'thunderstormSound', {
        name: 'Custom sounds effects: Storm',
        hint: 'Let you change the sounds effects for whatever you prefer.',
        scope: 'world',
        config: false,
        type: String,
        filePicker: 'audio',
        default: thunderstormSound,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'heavyRainSound', {
        name: 'Custom sounds effects: Heavy Rain',
        hint: 'Let you change the sounds effects for whatever you prefer.',
        scope: 'world',
        config: false,
        type: String,
        filePicker: 'audio',
        default: heavyRainSound,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });
    
    game.settings.register(MODULE, 'currentWeather', {
        name: 'weatherData',
        hint: '',
        scope: 'world',
        config: false,
        type: Object,
        default: currentWeather,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });
    
    game.settings.register(MODULE, 'toggleApp', {
        name: 'toggleApp',
        hint: '',
        scope: 'world',
        config: false,
        type: Number,
        default: 1,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    /**********************
    DEBUG
    **********************/
    game.settings.register(MODULE, 'debug', {
        name: 'Debug',
        hint: `Activate debug to show console logs`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: debug,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });
}

// function that get the settings options and assign to the variables
export function cacheSettings() {
    toggleApp = game.settings.get(MODULE, 'toggleApp');
    autoApply = game.settings.get(MODULE, 'autoApply');
    instantApply = game.settings.get(MODULE, 'instantApply');
    enableHB = game.settings.get(MODULE, 'enableHB');
    enableSound = game.settings.get(MODULE, 'enableSound');
    blizzardSound = game.settings.get(MODULE, 'blizzardSound');
    rainSound = game.settings.get(MODULE, 'rainSound');
    thunderstormSound = game.settings.get(MODULE, 'thunderstormSound');
    heavyRainSound = game.settings.get(MODULE, 'heavyRainSound');
    currentWeather = game.settings.get(MODULE, 'currentWeather');
    weatherSource = game.settings.get(MODULE, 'weatherSource');
    debug = game.settings.get(MODULE, 'debug');
    topDownRain = game.settings.get(MODULE, 'topDownRain');
}
