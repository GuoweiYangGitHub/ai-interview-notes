import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import ExampleCatalog from '../components/ExampleCatalog.vue'
import ExampleExplorer from '../components/ExampleExplorer.vue'
import CapabilityMap from '../components/CapabilityMap.vue'
import CoreCapabilityCatalog from '../components/CoreCapabilityCatalog.vue'
import MermaidDiagram from './MermaidDiagram.vue'
import DocKindTabs from './DocKindTabs.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'sidebar-nav-after': () => h(DocKindTabs),
    })
  },
  enhanceApp({ app }) {
    app.component('ExampleCatalog', ExampleCatalog)
    app.component('ExampleExplorer', ExampleExplorer)
    app.component('CapabilityMap', CapabilityMap)
    app.component('CoreCapabilityCatalog', CoreCapabilityCatalog)
    app.component('MermaidDiagram', MermaidDiagram)
  },
} satisfies Theme
