/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'

// Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

export function registerPlugins (app) {
  app
    .use(vuetify)     // Vuetify setup
    .use(pinia)       // Pinia state management
    // No need to call `.use()` for Bootstrap as it is included globally via import
}
