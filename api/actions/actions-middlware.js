// add middlewares here related to actions
const Action = require('./actions-model');

function validateAction(req, res, next) {
    if (typeof req.body.notes !== 'string' || req.body.description === '') {
      res.status(400).json({ message: "missing required fields" });
      return;
    }
  
    req.act = { notes: req.body.notes, description: req.body.description };
    next();
}

function validateActionId(req, res, next) {
    Action.get(req.params.id)
        .then(act => {
            if(act) {
                req.existingAct = act;
                next();
            } else {
                res.status(404).json({ message: "Action not found" });
            }
        })
        .catch(() => {
            res.status(500).json({ message: "500 error" });
        })
}

module.exports = {
    validateActionId,
    validateAction
}