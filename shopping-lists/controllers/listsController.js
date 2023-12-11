import { renderFile } from "https://deno.land/x/eta@v2.2.0/mod.ts";
import * as requestUtils from "../utils/requestUtils.js";
import * as listsService from "../services/listsService.js";

const responseDetails = {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const addList = async (request) => {
    const formData = await request.formData();
    const name = formData.get("name");
  
    await listsService.createList(name);
  
    return requestUtils.redirectTo("/lists");
};


const viewActiveLists = async (request) => {
    const data = {
        lists: await listsService.findActiveLists(),
    };

    return new Response(await renderFile("../views/lists.eta", data), responseDetails);
};

const viewList = async (request) => {
    const url = new URL(request.url);
    const urlParts = url.pathname.split("/");
    const list_id = urlParts[2];
    const data = {list: await listsService.findListById(list_id), non_collected:await listsService.findAllNonCollectedItems(list_id), collected:await listsService.findAllCollectedItems(list_id),};
    return new Response(await renderFile("../views/list.eta", data), responseDetails);
}

const deactivateList = async (request) => {
    const url = new URL(request.url);
    const urlParts = url.pathname.split("/");
    const id = urlParts[2];
    console.log("id to deactivate "+id);
    await listsService.deactivateList(id);
    return requestUtils.redirectTo("/lists");
}

export {addList, viewActiveLists, viewList, deactivateList};