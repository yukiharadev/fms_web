import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { BlueTheme } from '@/themes/LightTheme'

export default createVuetify({
  components,
  directives,

  theme: {
    defaultTheme: 'BlueTheme',
    themes: {
      BlueTheme,
    },
  },

  defaults: {
    VBtn: {},
    VCard: {
      rounded: 'md',
    },
    VTextField: {
      rounded: 'lg',
    },
    VTooltip: {
      location: 'top',
    },
  },
})
