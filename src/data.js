import { writable } from 'svelte/store';	

export let data_store = writable(JSON.parse(` 
{
  "title": {
    "color": "indigo",
    "name": "URLink Catalog"
  },
  "categories": [
    {
      "name": "Useful Links",
      "color": "brown",
      "sites": [
        {
          "name": "user guide",
          "icon": "info",
          "url": "https://example.com"
        },
        {
          "name": "look up icon name",
          "icon": "search",
          "url": "https://fonts.google.com/icons?selected=Material+Icons&icon.query="
        }
      ]
    },
    {
      "name": "build-this-web-app",
      "color": "brown",
      "sites": [
        {
          "name": "svetle repl",
          "icon": "settings_ethernet",
          "url": "https://svelte.dev/repl/60dd956d60dc4fbebc3c21d89dadb7c2?version=3.42.6"
        },
				{
          "name": "svetle tut",
          "icon": "history_edu",
          "url": "https://svelte.dev/tutorial/basics"
        },
        {
          "name": "md icon doc",
          "icon": "insert_emoticon",
          "url": "https://google.github.io/material-design-icons/"
        },
        {
          "name": "md icon lib",
          "icon": "search",
          "url": "https://fonts.google.com/icons?selected=Material+Icons&icon.query="
        },
        {
          "name": "ui lib preview",
          "icon": "vrpano",
          "url": "http://gugel.io/papier/"
        },
        {
          "name": "ui css doc",
          "icon": "text_snippet",
          "url": "https://github.com/alexanderGugel/papier"
        },
        {
          "name": "cf worker ssr",
          "icon": "format_quote",
          "url": "https://github.com/lukeed/svelte-ssr-worker"
        }
      ]
    }
  ]
}
`))

