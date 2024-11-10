const asyncHandle = require('express-async-handler');
const JobModel = require('../models/jobModel');

const addNewJob = asyncHandle(async (req, res) => {
    const body = req.body;

    if (!body.title || !body.authorId) {
        return res.status(400).json({
            message: 'Title and Author ID are required',
        });
    }

    const newJob = new JobModel(body);
    await newJob.save();

    res.status(200).json({
        message: 'Job created successfully',
        data: newJob,
    });
});

module.exports = {
    addNewJob,
};
