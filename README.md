# URL Link Catalog

https://urlinkcat.pages.dev/#demo

URL Link Catalog, or yoUR Link Cat, is the everyone's customizable bookmark home page on the cloud. Dead simple to use. 


## Purpose

Why do we even need **an online bookmark page**? 

Suppose you are working on multiple projects/cases (such as students taking courses in different disciplinary) in a day, and you have to open certain web pages for each different projects. Remembering all demanding destinations for each project can be a burden to your mind.   

Browser's bookmarks may help, but what if you have to work on different browsers/devices in different locations? Or, what if you want to share groups of certain links to someone very gently? 

> This project is intent to participate [Cloudflare Developer Summer Challenge](https://challenge.developers.cloudflare.com/), check [Technology](#Technology) section to find what Cloudflare products are used.


## Appearance

| daily use | customize |
| --------- | --------- |
| ![student-example](https://user-images.githubusercontent.com/8279655/138989286-f03b91ea-17fc-4854-9917-912f1b16b841.png) | ![student-example-editing](https://user-images.githubusercontent.com/8279655/138989493-6817babc-b0aa-489e-88ce-12594deb2c5f.png) |

URL Link Catalog bring you a fresh look, which is different than most bookmark services you have ever seen. 

Instead of website's icon (favicon) used in most other bookmark service, you can fully customize the icon of each link button by using Google's Material Design Icons. 

Also subtitle bars can be colorful in your decision. Read detailed user guide below.


## User guide

Check out our official examples listed on <https://urlinkcat.pages.dev/#demo>. No matter you are a website developer, student, scientist, warrior, wizard or bard ... , you can always enjoy it.

1. All users are anonymous, no login required. Instead, come up with a unique page ID easy to remember. For example, if you decide your id is `JamesBond007`, go to `https://urlinkcat.pages.dev/#JamesBond007` on a web browser. 
> If you visit https://urlinkcat.pages.dev/ without specifing a page ID, it will generate a random ID
2. Setup your links. Click the 🔒 lock button on the bottom-right corner to unlock the editing mode. Then, feel free to add, edit and delete any categories and their items as you want. Read the pictures below for more details.
3. Click the 🔒 lock button again to save your works locally (within your browser session). Click the ☁️ cloud button to upload your masterpiece to the cloud (remote database). You will find a ✔️ green tick on the ☁️ cloud button if it's successfully saved.

![userguide1](https://user-images.githubusercontent.com/8279655/138989025-813443b5-5d92-46a8-84c0-9601d4e802da.png)

---

![userguide2](https://user-images.githubusercontent.com/8279655/138989036-0073b6f6-52f6-4dbc-ab6e-080e5529e54b.png)

After the page being cloudy saved, you (or anyone online) can open `https://urlinkcat.pages.dev/#JamesBond007` to use your bookmarks. 

If you want to keep your bookmark "privately", just use a page id difficult to guess. For example, `SUxPVkVV`.


## Build your own instance 

To satisfy your demand, you may consider to host your own instance. Here is how you can do. 

**Thanks to Cloudflare Pages, Workers & KV, the cost of launching this website is $0.**

### Setup on Cloudflare Pages 

1. Fork this repo on GitHub
2. You might change some config on "/src/App.svelte" and/or "/src/data.js"
3. Follow Cloudflare Pages' document at https://developers.cloudflare.com/pages/get-started
4. When it comes to "Build Configurations", set the config as below.

```
Framework preset: Svelte
Build command: npm run build
Build output directory: /public
```

Till then, your website instance will be ready to use, but only within a browser tab session. If you need to store data for a longer time on the cloud, setup of a middleware and database is necessary.

### Setup on Cloudflare Workers and KV

1. Create a new Cloudflare Workers instance on https://workers.dev/
2. Create a [KV namespace](https://developers.cloudflare.com/workers/learning/how-kv-works) and bind it to this workers instance. Its name is URLinkCat.
3. Copy & paste "/.cf_workers/main.js" to Cloudflare Workers' online editor. 
4. Save and deploy on the online editor. (`wrangler` not required at all)

Please double-check if the const `cf_workers` in "/src/App.svelte" matches the domain of your Cloudflare Workers' instance.

You will be all set, if you have good luck.

## Developer guide

> This repository also joins in the [Hacktoberfest](https://hacktoberfest.digitalocean.com/) event by DigialOcean. Welcome pull requests from everyone in October. 

### Technology

In terms of website infrastructure, this project uses [Cloudflare Pages](https://pages.dev) to host statistic web files,  [Cloudflare Workers](https://workers.dev) to handle network requests and [Cloudflare Workers KV](https://workers.dev) as its database. 

In terms of front-end tech stack, this project uses [Svelte](https://svelte.dev) as framework/compiler,  [Papier](http://gugel.io/papier/) as CSS library and [Material Design Icons](https://fonts.google.com/icons) as icon source. 

Application architecture is demonstrated below:

```
                ┌────────────x.pages.dev──┐
                │                         │
                │   ┌────────┐            │
                │   │.svelte │            │
                │   └─┬──────┘            │
                │     │                   │
                │     │ rollup            │
                │     ▼                   │
┌─────────┐     │   ┌───────────────┐     │   ┌───────────────┐    ┌──────────┐
│  User   ├─────┼──►│.html/.css/.js │◄────┼──►│y.z.workers.dev│◄──►│workers KV│
└─────────┘     │   └───────────────┘     │   └───────────────┘    └──────────┘
                │                         │       middleware         database
                └─────────────────────────┘
                      frontend
```


> more content coming soon ...

