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
                res.status(404).json({ message: "The project with the given id does not exist" });
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

module.exports = router;