const express = require('express');

const app = express();

app.use(express.json());

const projects = [];
let counterRequests = 0;

function countRequests(req, res, next) {
    counterRequests++;

    console.log(`Total requests: ${counterRequests}`);

    return next();
}

function checkIfIdExists(req, res, next) {
    const { id } = req.params;

    const project = projects.find(p => p.id === id);

    if (project) {
        return next();
    }

    return res.status(400).json({ error: 'Project not found'});

}

app.use(countRequests); 

app.get('/projects', (req, res) => {
    return res.json(projects);
});

app.post('/projects', (req, res) => {
    const { id, title } = req.body

    const project = { id, title, tasks: [] };
    
    projects.push(project);

    return res.json(project);
});

app.put('/projects/:id', checkIfIdExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    
    const project = projects.find(p => p.id === id);

    project.title = title;
    
    return res.json(project);
});

app.delete('/projects/:id', checkIfIdExists, (req, res) => {
    const { id } = req.params;
    
    const project = projects.find(p => p.id === id);

    projects.splice(project, 1);

    return res.send();

});

app.post('/projects/:id/tasks', checkIfIdExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id === id);

    project.tasks.push(title);

    return res.json(project);

});

app.listen(3000);