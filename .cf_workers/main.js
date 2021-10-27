const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Max-Age": "86400",
  }
  const dataSizeLimit = Number(12345);
  
/* settings for administrator's configurationn */

  const whiteList = [
      "urlinkcat.t6.workers.dev",
      "urlinkcat.pages.dev",
    //   "localhost",
    ]
  
  const preserved_pageid = [
      'demo',
      'undefined',
      'fuck'
    ]
  const adminToken = "12345";
  
/* end of settings for administrator's configurationn */
  
  addEventListener("fetch", (event) => {
    event.respondWith(
      handleRequest(event.request).catch(
        (err) => new Response(err.stack, { headers: corsHeaders, status: 500 })
      )
    );
  });
  
  /**
  BEGIN
   */
  async function handleRequest(request) {
    const { pathname } = new URL(request.url);
  
    
  
    let respHeaders = {
        ...corsHeaders,
      // Allow all future content Request headers to go back to browser
      // such as Authorization (Bearer) or X-Client-Name-Version
        "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers"),
        "Access-Control-Expose-Headers": "*" // allow client CORS fetch get all headers https://stackoverflow.com/a/54928828
      }
  
    // if (request.method == "OPTIONS") { //https://stackoverflow.com/a/67889538
    //   return new Response(null, { headers: respHeaders });
    // }
  
    if (!checkOrigin(request, whiteList)){
      console.log(whiteList)
      return new Response('forbidden origin', { headers: respHeaders, status: 400 });
    }
  
    // function reviewMessage
  
    if (pathname.startsWith("/get")) {
      const user_key = pathname.split("/")[2];
      const result = await URLinkCat.get(user_key);
      if (preserved_pageid.some((el) => user_key.includes(el))
      ){
        respHeaders["x-need-token"]=true;
      }
      if (result === null) {
        return new Response("404 nonexistent", {headers: respHeaders, status: 404});
      }else{
        return new Response(result, { headers: respHeaders, status: 200 });
      }
      }
  
    if (pathname.startsWith("/set")) {
      if (request.method == "OPTIONS") { //https://stackoverflow.com/a/67889538
        return new Response(null, { headers: corsHeaders, status: 204 });
      }else if (request.method != 'POST') {
        return new Response("405 please POST", { headers: respHeaders, status: 405});
      } 
  
      const user_key = pathname.split("/")[2];
      let user_data = await request.text();
  
      if (user_data.length > dataSizeLimit){
        return new Response("413 big data", { headers: respHeaders, status: 413});
      }
  
      if (!JSON.parse(user_data)){
        return new Response("400 invalid json format", { headers: respHeaders, status: 400});
      }
      user_data_json = JSON.parse(user_data);
      // check token
      if (preserved_pageid.includes(user_key)) {
        if (user_data_json.token == adminToken){
          delete user_data_json.token
        }else{
            return new Response("403 incorrect token", { headers: respHeaders, status: 403});
        }
      }
      user_data = JSON.stringify(user_data_json)
  
      const result = await URLinkCat.put(user_key, user_data);
      return new Response("uploaded", { headers: respHeaders, status: 200 });
    }
  
    return new Response("OK", { headers: respHeaders, status: 200 });
  }
  
  function checkOrigin(request, white_list){
    const origin = request.headers.get('Origin');
    if (!origin) return false;
    for (allowed of white_list){
      if (origin.includes(allowed)) {
        return true;
      }
    }
    return false;
  }