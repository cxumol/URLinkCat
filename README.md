# URL Link Catalog

https://urlinkcat.pages.dev/#demo

URL Link Catalog, or URLinkCat, is a **free, open-source, fully customizable, multi-user, cloud-synced and easy-to-use** bookmark web app.

> 🏆 This project won [Cloudflare Developer Summer Challenge](https://challenge.developers.cloudflare.com/). Thank you Cloudflare for the prize box!

## Who wants it?

You need it if you want to:
- Acess personal bookmarks **across browsers and devices**
- Acess bookmarks **across work and personal accounts**
- **Share** links with a group of people
- **Collaboratively** create a internet directory with firends
- Publish your up-to-date collection of your favorite AIs since 2023!

### Comparison 

| Feature | URLinkCat | [Linktree](https://linktr.ee) |
|-|-|-|  
| Cost | ✓ Free | ✓ Free + Paid plans |
| Cloud sync | ✓ | ✓ |
| Cross-device access | ✓ | ✓ | 
| Sharing links | ✓ | ✓ |
| Thumbnails | ✓ Emoji / Material Design Icons | ✓ Image upload / Icons  |  
| Manage links | ✓ One-click editing mode toggle | ✗ Complex admin backstage |  
| Multi-pages | ✓ As many as you want | ✗ Create only 1 page per account |  
| Collaboration | ✓ Anyone authorized can edit  | ✗ |
| Authorization | ✓ No need accounts<sup>1</sup> | ✓ Requires accounts ✗ less convenient|
| Open source | ✓ | ✗ | 
| App size | ✓ Lightweight | ✗ Heavy | 

1: Optional password protection coming soon™

## User Guide

Check out our official examples listed on <https://urlinkcat.pages.dev/#demo>. 

1. Visit. Go to `https://urlinkcat.pages.dev/#SuperHero123` to view the page of `SuperHero123`.<sup>1,2</sup>
2. Manage. No need accounts. Just click bottom-right 🔒 button to toggle editing mode.<sup>3</sup>
3. Preview. Click 🔒 button again to toggle viewer mode.
4. Save to Cloud. Click the ☁️ cloud button in viewer mode. If ☁️ shift to ✔️, congratulations, your masterpiece is in the could!

Tips:
1. To make bookmark "private", use a page id hard to guess like `SUxPVkVV`. Search engines won't know unless you speak it out loud.  
2. Visiting https://urlinkcat.pages.dev/ barely will give you a random ID.
3. You will need codename to change thumbnails and colors, and the codenames can be found from the default "How to Use" section.

## Host your own instance

| Infrastructure | Cost |
|-|-|  
| Cloudflare Pages | $0 |
| Cloudflare Workers | $0 |
| Cloudflare KV database | $0 |
| Cloudflare subdomain | $0 |
| Total | $0 |

### Front-end hosting on Cloudflare Pages

1. Fork this repo on GitHub
2. You might change some config on "/src/App.svelte" and/or "/src/data.js"
3. Follow the Cloudflare Pages' document at https://developers.cloudflare.com/pages/get-started
4. When it comes to "Build Configurations", set the config as below.

```
Framework preset: Svelte
Build command: pnpm run build
Build output directory: /public
```

> Now your instance is ready to use, but only within a browser tab session. If you want to enable cloud saving, keep following steps blow.

### Back-end hosting on Cloudflare Workers and KV

1. Create a new Cloudflare Workers instance on https://workers.dev/
2. Create a [KV namespace](https://developers.cloudflare.com/workers/learning/how-kv-works) and bind it to this workers instance. Default name is `URLinkCat`.
3. Copy & paste ".cf_workers/main.js" to [Cloudflare Workers Quick Edit](https://blog.cloudflare.com/improved-quick-edit/).
4. Click "Save and deploy" on Quick Edit. (`wrangler` not required)

Double check double-check if `cf_workers` in "/src/App.svelte" matches your back-end instance.

Now you should find your instance up and running!

## Developer notes

| Infrastructure | Purpose |
|-|-|  
| [Cloudflare Pages](https://pages.dev/) | Static web files |
| [Cloudflare Workers](https://workers.dev/) |  Network requests handler |
| [Cloudflare KV](https://developers.cloudflare.com/kv/) | NoSQL database |

| Front-end | Purpose |
|-|-|  
| [Svelte](https://svelte.dev) | Framework / Compiler |
| [Papier](http://gugel.io/papier/) | CSS library |
| [Material Design Icons](https://fonts.google.com/icons) | Icon library |

Architecture:

```
                ┌────────────x.pages.dev──┐
                │                         │
                │   ┌────────┐            │
                │   │.svelte │            │
                │   └─┬──────┘            │
                │     │                   │
                │     │ compile           │
                │     ▼                   │
┌─────────┐     │   ┌───────────────┐     │   ┌───────────────┐    ┌──────────┐
│  User   ├─────┼──►│.html/.css/.js │◄────┼──►│y.z.workers.dev│◄──►│Workers KV│
└─────────┘     │   └───────────────┘     │   └───────────────┘    └──────────┘
                │                         │       middleware         database
                └─────────────────────────┘
                      frontend
```

### Contribution

All PRs are welcome. Here are some suggestions for improvement:

1. Depolyment on other playforms (vercel, deno deploy, render.com, etc.)
2. Open all links of a subgroup at once by a single click
3. Change orders by drag-and-drop
