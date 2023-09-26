import App from "./App.svelte";

import * as markdown from "markdown-wasm/dist/markdown.es.js";
import "markdown-wasm/dist/markdown.wasm";

// var app = new App({
// 	target: document.body
// });

const init = async () => {
  await markdown.ready;

  const app = new App({
    target: document.body,
    props: {
      // https://svelte.dev/docs#Creating_a_component
      markdown: markdown,
    },
  });
};

init();

// export default app;
