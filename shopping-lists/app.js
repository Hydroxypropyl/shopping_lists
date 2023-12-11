import { serve } from "./deps.js";
import { configure } from "./deps.js";

import * as itemController from "./controllers/itemController.js";
import * as listsController from "./controllers/listsController.js";
import * as statController from "./controllers/statController.js";
configure({
  views: `${Deno.cwd()}/views/`,
});


const handleRequest = async (request) => {
  const url = new URL(request.url);

  if (url.pathname === "/lists" && request.method === "POST") {
    return await listsController.addList(request);
  } else if(url.pathname.match("/lists/[0-9]+/deactivate") && request.method==="POST"){
    return await listsController.deactivateList(request);
  }else if(url.pathname.match("lists/[0-9]+/items/[0-9]+/collect") && request.method==="POST"){
    return await itemController.collectItem(request);
  }else if(url.pathname.match("lists/[0-9]+/items") && request.method==="POST"){
    return await itemController.addItem(request);
  }
  else if (url.pathname === "/lists" && request.method === "GET") {
    return await listsController.viewActiveLists(request);
  }else if(url.pathname.match("/lists/[0-9]+") && request.method==="GET"){
    return await listsController.viewList(request);
  }else if(url.pathname==="/" && request.method==="GET"){
    return await statController.handleMainRequest();
  }else{
    return new Response("Not found", { status: 404 });
  }
};

serve(handleRequest, { port: 7777 });
