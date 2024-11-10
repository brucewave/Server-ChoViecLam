const Router = require('express');
const { addNewJob } = require('../controllers/jobController');

const jobRouter = Router();

jobRouter.post('/addNew', addNewJob);


module.exports = jobRouter;
