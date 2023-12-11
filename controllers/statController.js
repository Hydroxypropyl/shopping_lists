import { renderFile } from "https://deno.land/x/eta@v2.2.0/mod.ts";
import * as listsService from "../services/listsService.js";

const responseDetails = {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
  };

const handleMainRequest = async (request) => {
    const nb_lists = await listsService.countList();
    const nb_items = await listsService.countItem();
    const data = {
        list_count: nb_lists[0].count,
        item_count: nb_items[0].count,
    };

    return new Response(await renderFile("../views/statistics.eta", data), responseDetails);
};

export { handleMainRequest };