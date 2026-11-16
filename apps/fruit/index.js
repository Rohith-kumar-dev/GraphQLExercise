import express from "express";
const fruit = express()
fruit.disable("x-powered-by");
const port = 3000
const user_url = "http://localhost:4000";
fruit.use(express.json());


const fruits = [{ id: 1, name: "Mango", addedBy: 1},
    { id: 2, name: "Mangoo", addedBy: 2},
    { id: 3, name: "Mangooo", addedBy: 3},
    { id: 4, name: "Mangoooo", addedBy: 4}];


fruit.get("/fruits", async (req, res) => {
    let users;
    try {
        users = await (await fetch(`${user_url}/users`)).json();
    } catch {
        return res.status(503).json({ error: "User service is unavailable" });
    }
    const nameById = new Map(users.map(u => [u.id, u.name]));

    res.json(fruits.map(fruit => ({...fruit, addedByName: nameById.get(fruit.addedBy) ?? null,})));
});

fruit.get("/fruits/:id", async (req, res) => {
    const id = Number(req.params.id);
    const found = fruits.find(fruit => fruit.id === id);
    if (!found) return res.status(404).json({ error: "Fruit not found" });

    let addedByName = null;
    try {
        const response = await fetch(`${user_url}/users/${found.addedBy}`);
        if (response.ok) {
            const user = await response.json();
            addedByName = user.name;
        }
    } catch (error) {
        addedByName = null;
    }
    res.json({ ...found, addedByName });
});




fruit.post("/fruits", async (req, res) => {
    const {name, addedBy} = req.body

    if (!name || !addedBy) {
        return res.status(400).json({ error: "Both name and addedBy are required"});
    }
    let response;
    try {
        response = await fetch(`${user_url}/users/${addedBy}`);
    } catch {
        return res.status(503).json({ error: "User service is unavailable" });
    }
    if (response.status === 404) {
        return res.status(404).json({ error: `User ${addedBy} not found` });
    }
    const newFruit = { id: fruits.length+1 , name: name, addedBy: Number(addedBy)};
    fruits.push(newFruit);
    res.status(201).json(newFruit);
});



fruit.put("/fruits/:id", async (req, res) => {
    const id = Number(req.params.id);
    const found = fruits.find(fruit => fruit.id === id);
    if (!found) return res.status(404).json({ error: "Fruit not found" });

    const { name, addedBy } = req.body;
    if (!name || !addedBy) {
        return res.status(400).json({ error: "Both name and addedBy are required" });
    }

    let response;
    try {
        response = await fetch(`${user_url}/users/${addedBy}`);
    } catch {
        return res.status(503).json({ error: "User service is unavailable" });
    }
    if (response.status === 404) {
        return res.status(404).json({ error: `User ${addedBy} not found` });
    }

    found.name = name;
    found.addedBy = Number(addedBy);
    res.json(found);
});



fruit.delete("/fruits/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = fruits.findIndex(f => f.id === id);
  if (index === -1) return res.status(404).json({ error: "Fruit not found" });

  fruits.splice(index, 1);
  res.status(204).send();
});



fruit.listen(port, () => console.log(`fruit service is on ${ port }`));