const Router = require('express');
const { addNewJob, getJobs, getEvents, handleUpdateFollowers, getFollowers, getJobsByAuthor } = require('../controllers/jobController');

const jobRouter = Router();

jobRouter.post('/addNew', addNewJob);
jobRouter.get('/', getJobs);
jobRouter.get('/getEvents', getEvents);
jobRouter.post('/updateFollowers', handleUpdateFollowers);
jobRouter.get('/getFollowers', getFollowers);
jobRouter.get('/author/:authorId', getJobsByAuthor);


module.exports = jobRouter;
