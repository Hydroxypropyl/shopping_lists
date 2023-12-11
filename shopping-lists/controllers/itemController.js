import { renderFile } from "https://deno.land/x/eta@v2.2.0/mod.ts";
import * as requestUtils from "../utils/requestUtils.js";
import * as listsService from "../services/listsService.js";


const addItem = async (request) => {
  const url = new URL(request.url);
  const urlParts = url.pathname.split("/");
  const list_id = urlParts[2];
  const formData = await request.formData();
  const name = formData.get("name");
  await listsService.addItemToList(name, list_id);
  return requestUtils.redirectTo(`/lists/${list_id}`);
};

const collectItem = async(request) => {
  const url = new URL(request.url);
  const urlParts = url.pathname.split("/");
  const list_id = urlParts[2];
  const item_id = urlParts[4];
  await listsService.markCollected(item_id);
  return requestUtils.redirectTo(`/lists/${list_id}`);
}

export {addItem, collectItem};
