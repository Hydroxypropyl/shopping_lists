import { executeQuery } from "../database/database.js";

// ============== for lists =================
const findListById = async (id) => {
  const rows = await executeQuery(`SELECT * FROM shopping_lists WHERE id = ${ id }`);

  if (rows && rows.length > 0) {
    return rows[0];
  }

  return { id: 0, name: "Unknown" };
};

const findAllLists = async() => {
  return await executeQuery(`SELECT * FROM shopping_lists`);
};

const findActiveLists = async() => {
  return await executeQuery(`SELECT* FROM shopping_lists WHERE active=TRUE`);
};

const createList = async (name) => {
  await executeQuery(`INSERT INTO shopping_lists (name) VALUES ('${ name }')`);
};

const deactivateList = async(id) => {
  await executeQuery(`UPDATE shopping_lists SET active = FALSE WHERE id = ${ id }`);
};

const countList = async () => {
  return await executeQuery(`SELECT COUNT(*) FROM shopping_lists`);
};

// ================ for items ====================
const findItemsByListId =async (id) => {
  return await executeQuery(`SELECT * FROM shopping_list_items WHERE shopping_list_id = ${ id } ORDER BY collected, name`);
};

const markCollected = async (item_id) => {
  await executeQuery(`UPDATE shopping_list_items SET collected = TRUE WHERE id = ${ item_id }`);
};

const addItemToList = async (name, list_id) => {
  await executeQuery(`INSERT INTO shopping_list_items (name, shopping_list_id) VALUES ('${name}', ${list_id})`);
};

const findAllNonCollectedItems = async (list_id) => {
  return await executeQuery(`SELECT * FROM shopping_list_items WHERE collected = false AND shopping_list_id = (${list_id}) ORDER BY name`);
};

const findAllCollectedItems = async(list_id) => {
  return await executeQuery(`SELECT * FROM shopping_list_items WHERE collected = true AND shopping_list_id = (${list_id}) ORDER BY name`);
}

const countItem = async () => {
  return await executeQuery(`SELECT COUNT(*) FROM shopping_list_items`);
};


export {markCollected, addItemToList, findAllNonCollectedItems, findAllCollectedItems, createList, findActiveLists,findAllLists, findListById, deactivateList, countList , findItemsByListId, countItem};
