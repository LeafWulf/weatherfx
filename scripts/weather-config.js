/* 
export const scorchingHeat = {
    name: '',
    hasSound: false,
    filters: [],
    effects: false,
    effectsArray: [],
    filtersArray: []
} 
*/

export const ashfall = {
    name: "Ashfall",
    hasSound: false,
    filters: [],
    effects: true,
    effectsArray: [{
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
    },
    {
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
    }],
    filtersArray: []
}

export const blizzard = {
    name: 'Blizzard',
    hasSound: false,
    filters: [], //order: color, bloom
    effects: true,
    effectsArray: [{
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
    },
    {
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
    },
    {
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
    }],
    filtersArray: []
}

export const scorchingHeat = {
    name: 'Scorching Heat',
    hasSound: false,
    filters: ['color'],
    effects: false,
    effectsArray: [],
    filtersArray: [{
        "color": {
            "apply": true,
            "value": "#fef486"
        },
        "saturation": 1,
        "contrast": 1,
        "brightness": 1.2,
        "gamma": 1,
        "red": 0.996078431372549, "green": 0.9568627450980393, "blue": 0.5254901960784314
    }]
}

export const freezingCold = {
    name: 'Freezing Cold',
    hasSound: false,
    filters: ['color'],
    effects: false,
    effectsArray: [],
    filtersArray: [{
        "color": {
            "apply": true,
            "value": "#95dcea"
        },
        "saturation": 1,
        "contrast": 1,
        "brightness": 1,
        "gamma": 1
    }]
}

export const clearSkies = {
    name: 'Clear Skies',
    hasSound: false,
    filters: [],
    effects: false,
    effectsArray: [],
    filtersArray: []
}

export const heavyRain = {
    name: 'Heavy Rain',
    hasSound: false,
    filters: ['color'],
    effects: true,
    effectsArray: [{
        "type": "raintop",
        "options": {
            "scale": 1.3,
            "speed": 1.8,
            "lifetime": 1.2,
            "density": 2,
            "tint": {
                "apply": false,
                "value": "#ffffff"
            }
        }
    },
    {
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
    },
    {
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
    }],
    filtersArray: [{
        "color": {
            "apply": true,
            "value": "#d1d1d1"
        },
        "saturation": 0.8,
        "contrast": 1,
        "brightness": 1,
        "gamma": 1,
        "red": 0.8196078431372549, "green": 0.8196078431372549, "blue": 0.8196078431372549
    }]
}

export const rain = {
    name: 'Rain',
    hasSound: false,
    filters: [],
    effects: true,
    effectsArray: [{
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
    },
    {
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
    },
    {
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
    }],
    filtersArray: []
}

export const snow = {
    name: 'Snow',
    hasSound: false,
    filters: [],
    effects: false,
    effectsArray: [],
    filtersArray: []
}

export const thunderstorm = {
    name: 'Thunderstorm',
    hasSound: false,
    filters: [],
    effects: true,
    effectsArray: [{
        "type": "raintop",
        "options": {
            "scale": 1.3,
            "speed": 1.8,
            "lifetime": 1.2,
            "density": 2,
            "tint": {
                "apply": false,
                "value": "#ffffff"
            }
        }
    },
    {
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
    },
    {
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
    }],
    filtersArray: [{
        "color": {
            "apply": true,
            "value": "#d1d1d1"
        },
        "saturation": 0.8,
        "contrast": 1,
        "brightness": 1,
        "gamma": 1,
        "red": 0.8196078431372549, "green": 0.8196078431372549, "blue": 0.8196078431372549
},
    {
        "frequency": 1000,
        "spark_duration": 500,
        "brightness": 1.3
}]
}