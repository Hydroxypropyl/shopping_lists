const { test, expect } = require("@playwright/test");

test("There is a form to add a list at /lists", async ({ page }) => {
    const response = await page.goto("/lists");

    //Correct titles
    await expect(page.locator("h2")).toHaveText(["Current shopping lists", "Create a new list"]);

    //Select the elements
    const formExists = await page.waitForSelector('form');
    const nameInputExists = await page.waitForSelector('input[name="name"]');
    const submitButtonExists = await page.waitForSelector('input[type="submit"][test="create"]');

    //Check existence
    expect(formExists).toBeTruthy();
    expect(nameInputExists).toBeTruthy();
    expect(submitButtonExists).toBeTruthy();

    //Correct submit button
    await expect(page.locator('input[type="submit"][test="create"]')).toHaveText("Create");
});


test("Adds a list on the page /lists", async ({ page }) => {
    //Add a random instance to track
    await page.goto("/lists");
    const listName = `Random list ${Math.floor(Math.random()*100)}`;
    await page.locator("input[type=text]").type(listName);
    await page.locator('input[type=submit][test="create"]').click();

    //Check if the instance exists
    const entryExists = await page.waitForSelector(`li >> text='${listName}'`);
    expect(entryExists).toBeTruthy();
});


test("Check if lists have a deactivate form", async ({ page }) => {
    //Start by adding a list to track
    await page.goto("/lists");
    const id = Math.floor(Math.random()*10000);
    const listName = `list_${id}`;
    await page.locator("input[type=text]").type(listName);
    await page.locator('input[type=submit][test="create"]').click();

    //Check if said list has a deactivate form
    const formExists = await page.locator(`input[type=submit][test=deactivate_${listName}]`);
    expect(formExists).toBeTruthy();
});


test("Check if a list can be deactivated @fail", async ({ page }) => {
    //Create an instance to track
    await page.goto("/lists");
    const id = Math.floor(Math.random()*10000);
    const listName = `list_${id}`;
    await page.locator("input[type=text]").type(listName);
    await page.locator('input[type=submit][test="create"]').click();
    //Find the corresponding deactivate form and click it
    const form = await page.locator(`input[type=submit][test=deactivate_${listName}]`);
    await form.click();

    //Check if the list is still displayed : it should fail !
    expect(page.locator(`li >> text='${listName}'`)).toBeTruthy();
});


test("There is a form to add items at/lists/{id}", async ({ page }) => {
    //Create a list from the main menu
    await page.goto("/lists");
    const listName = `Random list ${Math.floor(Math.random()*100000)}`;
    await page.locator("input[type=text]").type(listName);
    await page.locator("input[type=submit][test='create']").click();
  
    //Go to the new instance
    await page.locator(`a >> text='${listName}'`).click();
    
    //Correct titles
    await expect(page.locator("h2")).toHaveText(["Content of the list", "Add a new entry to the list:"]);
  
    //Select the elements
    const formExists = await page.waitForSelector('form');
    const nameInputExists = await page.waitForSelector('input[name="name"]');
    const submitButtonExists = await page.waitForSelector('input[type="submit"][test="add_item"]');

    //Check existence
    expect(formExists).toBeTruthy();
    expect(nameInputExists).toBeTruthy();
    expect(submitButtonExists).toBeTruthy();

    //Correct submit
    await expect(page.locator('input[type="submit"][test="add_item"]')).toHaveText("Add item");
});

test("Adding an item on a list", async ({ page }) => {
    //Create a list from the main menu
    await page.goto("/lists");
    const listName = `Random list ${Math.floor(Math.random()*100)}`;
    await page.locator("input[type=text]").type(listName);
    await page.locator("input[type=submit][test='create']").click();
  
    //Go to the new instance
    await page.locator(`a >> text='${listName}'`).click();

    //Add an item to the list
    const itemName = `Item ${Math.floor(Math.random()*100)}`;
    await page.locator("input[type=text]").type(itemName);
    await page.locator("input[type=submit][test='add_item']").click();
  
    //Check if the item was successfully added to the list
    const entryExists = await page.waitForSelector(`li >> text='${itemName}'`);
    expect(entryExists).toBeTruthy();
});


test("Can mark an item as collected", async ({ page }) => {
    //Create a list from the main menu
    await page.goto("/lists");
    const listName = `Random list ${Math.floor(Math.random()*100000)}`;
    await page.locator("input[type=text]").type(listName);
    await page.locator("input[type=submit][test='create']").click();
  
    //Go to the new instance
    await page.locator(`a >> text='${listName}'`).click();

    //Add an item to the list
    const itemName = `Item ${Math.floor(Math.random()*100000)}`;
    await page.locator("input[type=text]").type(itemName);
    await page.locator("input[type=submit][test='add_item']").click();
  
    //Check if the item can be marked as collected
    const collectedExists = await page.locator(`input[type=submit][test='${itemName}']`);
    expect(collectedExists).toBeTruthy();

    await collectedExists.click();
    await expect(page.locator(`del`)).toHaveText(`${itemName}`);
});

test("Main page contains information on the lists and items", async ({ page }) => {
    //First create a list to have an instance
    await page.goto("/lists");
    const listName = `Random list ${Math.floor(Math.random()*100000)}`;
    await page.locator("input[type=text]").type(listName);
    await page.locator("input[type=submit][test='create']").click();
  
    //Go to the main page to check the statistics
    await page.locator(`a >> text='Main page'`).click();
    
    //Select the elements

    //Check if there are 2 <p> elements
    await expect(page.locator(`p`)).toHaveCount(2); 

    const firstParagraphText = await page.locator(`p`).nth(0);
    const secondParagraphText = await page.locator(`p`).nth(1);
    
    //Check content of the paragraphs
    await expect(firstParagraphText).toContainText('Shopping lists'); 
    await expect(secondParagraphText).toContainText('Shopping list items'); 
});
