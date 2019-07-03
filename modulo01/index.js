const express = require('express');

const app = express();

app.use(express.json());

const users = ['Diego', 'Robson', 'Victor'];

app.use((req, res, next) => {
    console.log('teste');
    next();
});

function checkUsersExists(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({ error: 'User not found'});
    }
    return next();    
}

function checkUserInArray(req, res, next) {

    const user = users[req.params.index];

    if (!user) {
        return res.status(400).json({ error: 'User does not exists'});    
    }

    req.user = user;

    return next();
}

app.get('/users', (req, res) => {
    return res.json(users);
});

app.get('/users/:index', checkUserInArray, (req, res) => {
    return res.json(req.user);
});

app.post('/users', checkUsersExists, (req, res) => {
    const { name } = req.body;

    users.push(name);

    return res.json(users);
});

app.put('/users/:index', checkUsersExists, checkUserInArray, (req, res) => {
    const { index } = req.params;
    const { name } = req.body;

    users[index] = name;

    return res.json(users);
});

app.delete('/users/:index', checkUserInArray, (req, res) => {
    const { index } = req.params;

    users.splice(index, 1);

    return res.send();
});

app.listen(3000);