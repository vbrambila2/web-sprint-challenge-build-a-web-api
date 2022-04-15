// Write your "actions" router here!
const express = require('express');

const Action = require('./actions-model');

const { validateAction, validateActionId } = require('../actions/actions-middlware');

const router = express.Router();

router.get('/', (req, res) => {
    Action.get(req.params.id)
        .then(act => {
            res.json(act);
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({ message: "500 error" });
        })
});

router.get('/:id', (req, res) => {
    Action.get(req.params.id)
        .then(act => {
            if(act) {
                res.json(act);
            } else {
                res.status(404).json({ message: "The action with the given id does not exist" });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "500 error" });
        })
});

router.post('/', validateAction, validateActionId, (req, res, next) => {
    const actionInfo = { project_id: req.body.project_id, notes: req.body.notes, description: req.body.description };
    console.log(actionInfo);

    Action.insert(actionInfo)
        .then(act => {
            console.log("act", act);
            res.status(201).json(act);
        })
        .catch(error => next({ error }));
});

router.put('/:id', (req, res) => {
    if(!req.body.notes || !req.body.description || !req.body.project_id) {
        res.status(400).json({ message: "Name and/or Description must be provided" });
    } else {
        Action.get(req.params.id)
            .then(act => {
                if(!act) {
                    res.status(404).json({ message: "The action with the given id does not exist" });
                } else {
                    return Action.update(req.params.id, req.body);
                }
            })
            .then(act => {
                return res.json(act);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: "500 error" });
            })
    }
});

module.exports = router;