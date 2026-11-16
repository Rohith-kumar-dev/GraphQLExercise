import express from "express";
const user = express()
user.disable("x-powered-by");
const port = 4000
user.use(express.json());

const users = [{ id: 1, name: "Riya" },
    { id: 2, name: "Riyaa" },
    { id: 3, name: "Riyaaa" },
    { id: 4, name: "Riyaaaa" }];


user.get("/users", (req, res) => {
  res.json(users);
});

user.get("/users/:id", (req, res) => {
  const found = users.find(user => user.id === Number(req.params.id));
  if (!found) return res.status(404).json({error: "User not Found"});
  res.json(found);
});



user.post("/users", (req, res) => {
  const name = req.body.name;

  if (!name){
    return res.status(400).json({ error: "Name is required" });
  }
  const newUser = { id: users.length+1 , name: name };
  users.push(newUser);
  res.status(201).json(newUser);
});



user.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const found = users.find(user => user.id === id);
  if (!found) return res.status(404).json({ error: "User not Found" });

  const {name} = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });
  found.name = name;

  console.log(users);
  res.json(found);
});




user.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: "User not Found" });
  users.splice(index, 1);
  res.status(204).send();
});



user.listen(port, () => console.log(`user service is on ${ port }`));