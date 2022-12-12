import { blizzardSound, rainSound, thunderstormSound, heavyRainSound, currentWeather } from "./settings.js"; //imports settings variables, necessary because they go inside eval(effectName + 'Sound')

// Weather Effect class
export class Effect {
    constructor(name, type, hasSound, sound, soundName, effectsArray, filtersArray) {
        this.name = name
        this.type = type
        this.hasSound = hasSound
        this.sound = sound
        this.soundName = soundName // gambiarra por enquanto. não lembro pra que serve mais
        this.effectsArray = effectsArray
        this.filtersArray = filtersArray
    }
}

// Function that create the weather effect with the proper sound effects, weather 'item' names to place in the chat and fxmaster particles and filters
export function createEffect(effectName) {
    let effectCondition = {};
    switch (effectName) {
        case 'clear': return effectCondition = new Effect(effectName, 'Clear', false, '', '', [], [])
        case 'fair': return effectCondition = new Effect(effectName, 'Fair', false, '', '', [lightFog], [])
        case 'partlyCloudy': return effectCondition = new Effect(effectName, 'Partly Cloudy', false, '', '', [moderateClouds], [])
        case 'mostlyCloudy': return effectCondition = new Effect(effectName, 'Mostly Cloudy', false, '', '', [heavyClouds], [])
        case 'overcast': return effectCondition = new Effect(effectName, 'Overcast', false, '', '', [grayClouds], [])

        case 'drizzle': return effectCondition = new Effect(effectName, '', false, '', '', [lightRain], [])
        case 'snowGrains': return effectCondition = new Effect(effectName, '', false, '', '', [lightSnow, snowClouds], [coldClimate])

        case 'lightRain': return effectCondition = new Effect(effectName, '', false, '', '', [lightRain, lightFog], [])
        case 'moderateRain': return effectCondition = new Effect(effectName, 'Moderate Rain', true, 'rainSound', 'rain', [moderateRain, lightFog], [])
        case 'heavyRain': return effectCondition = new Effect(effectName, 'Heavy Rain', true, eval(effectName + 'Sound'), 'heavyRain', [heavyRain, moderateFog], [darkClimate])

        case 'lightFreezingRain': return effectCondition = new Effect(effectName, '', false, '', '', [lightRain, lightFog], [coldClimate])
        case 'moderateFreezingRain': return effectCondition = new Effect(effectName, 'Moderate Freezing Rain', true, 'rainSound', 'rain', [moderateRain, lightFog], [coldClimate])
        case 'heavyFreezingRain': return effectCondition = new Effect(effectName, 'Heavy Freezing Rain', true, 'heavyRainSound', 'heavyRain', [heavyRain, moderateFog], [coldClimate])

        case 'lightSnow': return effectCondition = new Effect(effectName, '', false, '', '', [lightSnow, snowClouds, snowFog], [])
        case 'moderateSnow': return effectCondition = new Effect(effectName, 'Snow', false, '', '', [snowFall, snowClouds, snowFog], [coldClimate])
        case 'heavySnow': return effectCondition = new Effect(effectName, 'Snow', false, '', '', [snowFall, snowClouds, snowFog], [coldClimate])
        case 'blizzard': return effectCondition = new Effect(effectName, 'Blizzard', true, eval(effectName + 'Sound'), 'blizzard', [blizzard, snowClouds, snowFog], [coldClimate])

        case 'thunderstorm': return effectCondition = new Effect(effectName, 'Thunderstorm', true, eval(effectName + 'Sound'), 'thunderstorm', [heavyRain, heavyClouds, moderateFog], [darkClimate, lightning])

        case 'hail': return effectCondition = new Effect(effectName, 'Hail', false, eval(effectName + 'Sound'), '', [hail, heavyRain, heavyClouds, moderateFog], [darkClimate])

        case 'fireyRain': return effectCondition = new Effect(effectName, 'Scorching Heat', false, '', '', [], [])    
        case 'ashfall': return effectCondition = new Effect(effectName, 'Ashfall', false, '', '', [ashes, grayFog], [])
        case 'sunAsh': return effectCondition = new Effect(effectName, 'Ashfall', false, '', '', [ashes, grayFog], [darkClimate])
        case 'darkSky': return effectCondition = new Effect(effectName, 'Overcast', false, '', '', [heavyClouds], [darkClimate])
        case 'overcastFreezing': return effectCondition = new Effect(effectName, 'Overcast', false, '', '', [lightRain, grayClouds], [coldClimate])
        case 'overcastDrizzle': return effectCondition = new Effect(effectName, 'Overcast', false, '', '', [lightRain, grayClouds], [])
        case 'overcastSnow': return effectCondition = new Effect(effectName, 'Freezing Cold', false, '', '', [lightSnow, snowClouds], [coldClimate])
        case 'drought': return effectCondition = new Effect(effectName, '', false, '', '', [], [])
    }
}

const lightSnow = {
    "type": "snow",
    "options": {
        "scale": 0.5,
        "direction": 180,
        "speed": 0.1,
        "lifetime": 0.5,
        "density": 0.025,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const lightRain = {
    "type": "raintop",
    "options": {
        "scale": 1.3,
        "speed": 1.8,
        "lifetime": 1.2,
        "density": 0.025,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const lightFog = {
    "type": "fog",
    "options": {
        "scale": 1,
        "speed": 1,
        "lifetime": 1,
        "density": 0.01,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const moderateRain = {
    "type": "raintop",
    "options": {
        "scale": 1.3,
        "speed": 1.8,
        "lifetime": 1.2,
        "density": 0.5,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const moderateClouds = {
    "type": "clouds",
    "options": {
        "scale": 1,
        "direction": 180,
        "speed": 1,
        "lifetime": 1,
        "density": 0.03,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const moderateFog = {
    "type": "fog",
    "options": {
        "scale": 1,
        "speed": 1,
        "lifetime": 1,
        "density": 0.01,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const snowClouds = {
    "type": "clouds",
    "options": {
        "scale": 3,
        "direction": 180,
        "speed": 2,
        "lifetime": 1,
        "density": 0.02,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const snowFog = {
    "type": "fog",
    "options": {
        "scale": 0.7,
        "speed": 2,
        "lifetime": 0.7,
        "density": 0.08,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const snowFall = {
    "type": "snow",
    "options": {
        "scale": 0.5,
        "direction": 180,
        "speed": 0.1,
        "lifetime": 0.5,
        "density": 0.5,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const heavyClouds = {
    "type": "clouds",
    "options": {
        "scale": 3,
        "direction": 180,
        "speed": 1.5,
        "lifetime": 2,
        "density": 0.05,
        "tint": {
            "apply": true,
            "value": "#787878"
        }
    }
}
const heavyRain = {
    "type": "raintop",
    "options": {
        "scale": 1.5,
        "speed": 1.8,
        "lifetime": 0.7,
        "density": 0.6,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const lightning = {
    "type": "lightning",
    "options": {
        "frequency": 1000,
        "spark_duration": 500,
        "brightness": 1.3
    }
}

const blizzard = {
    "type": "snowstorm",
    "options": {
        "scale": 0.7,
        "direction": 180,
        "speed": 3,
        "lifetime": 0.7,
        "density": 0.5,
        "tint": {
            "apply": false,
            "value": "#ffffff"
        }
    }
}
const hail = {
    "type": "snowstorm",
    "options": {
        "scale": 3,
        "direction": 60,
        "speed": 1.2,
        "lifetime": 0.1,
        "density": 0.05,
        "tint": {
            "apply": true,
            "value": "#bee0ee"
        }
    }
}

const hotClimate = {
    "type": "color",
    "options": {
        "color": {
            "apply": true,
            "value": "#fef486"
        },
        "saturation": 1,
        "contrast": 1,
        "brightness": 1.2,
        "gamma": 1,
        "red": 0.996078431372549, "green": 0.9568627450980393, "blue": 0.5254901960784314
    }
}
const coldClimate = {
    "type": "color",
    "options": {
        "color": {
            "apply": true,
            "value": "#95dcea"
        },
        "saturation": 1,
        "contrast": 1,
        "brightness": 1,
        "gamma": 1
    }
}
const darkClimate = {
    "type": "color",
    "options": {
        "color": {
            "apply": true,
            "value": "#d1d1d1"
        },
        "saturation": 0.8,
        "contrast": 1,
        "brightness": 1,
        "gamma": 1,
        "red": 0.8196078431372549, "green": 0.8196078431372549, "blue": 0.8196078431372549
    }
}

const grayFog = {
    "type": "fog",
    "options": {
        "scale": 1,
        "speed": 1,
        "lifetime": 1,
        "density": 0.05,
        "tint": {
            "apply": true,
            "value": "#8f8f8f"
        }
    }
}
const grayClouds = {
    "type": "clouds",
    "options": {
        "scale": 3,
        "direction": 180,
        "speed": 1,
        "lifetime": 2,
        "density": 0.03,
        "tint": {
            "apply": true,
            "value": "#5e5e5e"
        }
    }
}
const ashes = {
    "type": "leaves",
    "options": {
        "scale": 0.4,
        "speed": 1,
        "lifetime": 1,
        "density": 0.4,
        "tint": {
            "apply": true,
            "value": "#000000"
        }
    }
}