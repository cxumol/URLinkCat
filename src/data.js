import { writable } from 'svelte/store';	

export let data_store = writable(JSON.parse(` 
{
   "title":{
      "color":"indigo",
      "name":"URL Link Catalog"
   },
   "categories":[
      {
         "name":"How to Use",
         "color":"brown",
         "sites":[
            {
               "name":"User Guide",
               "icon":"info",
               "url":"https://github.com/cxumol/URLinkCat/blob/master/README.md"
            },
	    {
               "icon":"theater_comedy",
               "url":"https://urlinkcat.pages.dev/#demo",
               "name":"Examples"
            },
            {
               "name":"Icons Available to Use",
               "icon":"search",
               "url":"https://fonts.google.com/icons?selected=Material+Icons&icon.query="
            },
            {
               "icon":"palette",
               "url":"https://github.com/alexanderGugel/papier/blob/master/src/config.styl",
               "name":"Colors Available to Use"
            },
            {
               "icon":"cloud_sync",
               "url":"#",
               "name":"Don't Forget to Save to Cloud"
            }
         ]
      }
   ]
}
`))

