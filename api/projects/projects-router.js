// Write your "projects" router here!
const express = require('express');

const Project = require('./projects-model');

const router = express.Router();

router.get('/', (req, res) => {
    Project.get(req.params.id)
        .then(pro => {
            res.json(pro);
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({ message: "500 error" });
        })
});

router.get('/:id', (req, res) => {
    Project.get(req.params.id)
        .then(pro => {
            if(pro) {
                res.json(pro);
            } else {
                res.status(404).json({ message: "The project with the given id does not exist" });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "500 error" });
        })
});

router.post('/', (req, res) => {
    if(!req.body.name || !req.body.description) {
        res.status(400).json({ message: "Name and/or Description must be provided" });
    } else {
        Project.insert(req.body)
            .then(pro => {
                return Project.get(pro.id);
            })
            .then(pro => {
                res.status(201).json(pro);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: "500 error" });
            })
    }
});

router.put('/:id', (req, res) => {
    console.log(req.body.name, req.body.description, req.body.completed);
    if(!req.body.name || !req.body.description || req.body.completed === undefined) {
        res.status(400).json({ message: "Name and/or Description must be provided" });
    } else {
        Project.get(req.params.id)
            .then(pro => {
                if(!pro) {
                    res.status(404).json({ message: "The project with the given id does not exist" });
                } else {
                    return Project.update(req.params.id, req.body);
                }
            })
            .then(pro => {
                return res.json(pro);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: "500 error" });
            })
    }
});

router.delete('/:id', async (req, res) => {
    let possibleProject = await Project.get(req.params.id);

    if(!possibleProject) {
        res.status(404).json({ message: "The project with the given id does not exist" });
    } else {
        await Project.remove(req.params.id)
            .then(() => {
                res.json();
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: "500 error" });
            })
    }
});

router.get('/:id/actions', async (req, res) => {
    let project = await Project.get(req.params.id);

    if(!project) {
        res.status(404).json({ message: "The project with the given id does not exist" });
    } else {
        await Project.getProjectActions(req.params.id)
            .then(pro => {
                res.json(pro);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: "500 error" });
            })
    }
});

module.exports = router;