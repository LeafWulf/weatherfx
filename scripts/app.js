

export class weatherApp extends FormApplication {
    static _isOpen = true;

    async _render(force = false, options = {}) {
        await super._render(force, options);
        weatherApp._isOpen = true;
        // Remove the window from candidates for closing via Escape.
        delete ui.windows[this.appId];
    }

    // Override original #close method inherited from parent class.
    // async close(options = {}) {
    //   // If called by SmallTime, record that it is not longer visible.
    //   if (options.smallTime) {
    //     weatherApp._isOpen = false;
    //     game.settings.set('smalltime', 'visible', false);
    //   }
    //   return super.close(options);
    // }

    static get defaultOptions() {
        const pinned = game.settings.get('smalltime', 'pinned');

        const playerApp = document.getElementById('players');
        const playerAppPos = playerApp.getBoundingClientRect();

        // if (pinned) {
        //     this.initialPosition.setPosition({
        //         left: 15,
        //         top: $('#smalltime-app').css("top")
        //     });
        // }
        // else
        this.initialPosition = game.settings.get('smalltime', 'position');

        // if (pinned) {
        //     this.initialPosition.top = $('#weather-app').css("top", "calc(100vh - )");
        //     this.initialPosition.left = 15;
        // }

        return mergeObject(super.defaultOptions, {
            classes: ['form'],
            popOut: true,
            submitOnChange: true,
            closeOnSubmit: false,
            minimizable: false,
            template: 'modules/weatherfx/templates/weatherfx.html',
            id: 'weather-app',
            title: 'Weather FX',
            top: this.initialPosition.top,
            left: this.initialPosition.left,
        });
    }

    activateListeners(html) {
        super.activateListeners(html);

        let smallTimeApp = game.modules.get('smalltime').myApp
        let weatherApp = game.modules.get('weatherfx').myApp
        let pinned = game.settings.get('smalltime', 'pinned');

        // select the item element
        smallTimeApp._element.find('#dragHandle').on('mousedown', async function () {
            $('#weather-app').css("visibility", "hidden")
        })

        smallTimeApp._element.find('#dragHandle').on('mouseup', async function () {
            await new Promise(resolve => setTimeout(resolve, 100));
            // if (pinned) {
            //     weatherApp.setPosition({
            //         left: 15,
            //         top: $('#smalltime-app').css("top")
            //     });
            // } else {
                weatherApp.setPosition({
                    left: smallTimeApp.position.left,
                    top: smallTimeApp.position.top
                });
            // }
            $('#weather-app').css("visibility", "visible")
        })

        // Have to override this because of the non-standard drag handle, and
        // also to manage the pin lock zone and animation effects.

        // Toggle the date display div, if a calendar provider is enabled.
        // The inline CSS overrides are a bit hacky, but were the
        // only way I could get the desired behaviour.
        html.find('#rightHandle').on('click', async function () {
            if (!game.settings.get('weatherfx', 'show')) {
                $('#weather-app').addClass('show');
                $('#weather-app').animate({ width: '230px', left: "+=200" }, 80);
                await game.settings.set('weatherfx', 'show', true);
            } else {
                $('#weather-app').removeClass('show');
                $('#weather-app').animate({ width: '200px', left: "-=200" }, 80);
                await game.settings.set('weatherfx', 'show', false);
            }
        });
    }

    // Helper function for handling sockets.
    static emitSocket(type, payload) {
        game.socket.emit('module.smalltime', {
            type: type,
            payload: payload,
        });
    }

    // Convert the integer time value to hours and minutes.

    // Pin the app above the Players list.

    // Un-pin the app.

    // Toggle visibility of the main window.
    static async toggleAppVis(mode) {
        if (!game.modules.get('smalltime').viewAuth) return;
        if (mode === 'toggle') {
            if (game.settings.get('smalltime', 'visible') === true) {
                // Stop any currently-running animations, and then animate the app
                // away before close(), to avoid the stock close() animation.
                $('#weather-app').stop();
                $('#weather-app').css({ animation: 'close 0.2s', opacity: '0' });
                setTimeout(function () {
                    // Pass an object to .close() to indicate that it came from SmallTime,
                    // and not from an Escape keypress.
                    game.modules.get('smalltime').myApp.close({ smallTime: true });
                }, 200);
            } else {
                // Make sure there isn't already an instance of the app rendered.
                // Fire off a close() just in case, clears up some stuck states.
                if (weatherApp._isOpen) {
                    game.modules.get('smalltime').myApp.close({ smallTime: true });
                }
                game.modules.get('smalltime').myApp = await new weatherApp().render(true);
                game.settings.set('smalltime', 'visible', true);
            }
        } else if (game.settings.get('smalltime', 'visible') === true) {
            game.modules.get('weatherfx').myApp = await new weatherApp().render(true);
        }
    }
}
