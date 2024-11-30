const asyncHandle = require('express-async-handler');
const JobModel = require('../models/jobModel');


const toRoad = (val) => (val * Math.PI) / 180;

const calcDistanceLocation = ({
	currentLat,
	currentLong,
	addressLat,
	addressLong,
}) => {
	const r = 6371;
	const dLat = toRoad(addressLat - currentLat);
	const dLon = toRoad(addressLong - currentLong);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLon / 2) *
			Math.sin(dLon / 2) *
			Math.cos(toRoad(currentLat)) *
			Math.cos(toRoad(addressLat));
	return r * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};



const addNewJob = asyncHandle(async (req, res) => {
    const body = req.body;

    if (!body.title || !body.authorID) {
        return res.status(400).json({
            message: 'Title and Author ID are required',
        });
    }

    const newJob = new JobModel({
        title: body.title,
        description: body.description,
        locationTitle: body.locationTitle,
        locationAddress: body.locationAddress,
        position: body.position,
        photoUrl: body.photoUrl,
        price: body.price,
        category: body.category,
        authorID: body.authorID,
        startAt: body.startAt,
        endAt: body.endAt,
        date: body.date,
    });

    await newJob.save();

    res.status(200).json({
        message: 'Job created successfully',
        data: newJob,
    });
});


const getJobs = asyncHandle(async (req, res) => {
    res.status(200).json({
        message: 'Jobs retrieved successfully',
        data: [],
    });
});

const getEvents = asyncHandle(async (req, res) => {
	const { lat, long, distance, limit, date } = req.query;

	const events = await JobModel.find({})
		.sort({ createdAt: -1 })
		.limit(limit ?? 0);

	if (lat && long && distance) {
		const items = [];
		if (events.length > 0) {
			events.forEach((event) => {
				const eventDistance = calcDistanceLocation({
					currentLong: long,
					currentLat: lat,
					addressLat: event.position.lat,
					addressLong: event.position.long,
				});

				if (eventDistance < distance) {
					items.push(event);
				}
			});
		}

		res.status(200).json({
			message: 'get events ok',
			data: date ? items.filter(element => element.date > new Date(date)) : items,
		});
	} else {
		res.status(200).json({
			message: 'get events ok',
			data: date ? events.filter(element => element.date > new Date(date)) : events,
		});
	}
});

const handleUpdateFollowers = asyncHandle(async (req, res) => {
    const body = req.body;
	const { id, followers } = body;
	await JobModel.findByIdAndUpdate(id, { followers, updatedAt: Date.now() });
    res.status(200).json({
        message: 'Update followers ok',
		data: [],
    });
});

const getFollowers = asyncHandle(async (req, res) => {
    const { id } = req.query;
    const event = await JobModel.findById(id);
	if (event) {
		res.status(200).json({
			message: 'Get followers ok',
			data: event.followers ?? [],
		});
	} else {
		res.status(401).json({
			message: 'Job not found',
			data: [],
		});
	}
});

const getJobsByAuthor = asyncHandle(async (req, res) => {
    const { authorId } = req.params;

    if (!authorId) {
        return res.status(400).json({
            message: 'Author ID is required',
        });
    }

    const jobs = await JobModel.find({ authorID: authorId });

    const jobDetails = jobs.map(job => ({
        id: job._id,
        title: job.title,
        authorId: job.authorID,
        createdAt: job.createdAt,
		photoUrl: job.photoUrl,
		date: job.date,
		followers: job.followers,
		category: job.category,
		description: job.description,
		locationTitle: job.locationTitle,
		locationAddress: job.locationAddress,
		position: job.position,
		price: job.price,
    }));
	console.log(jobDetails);

    res.status(200).json({
        message: 'Jobs retrieved successfully',
        data: jobDetails,
    });
});

module.exports = {
    addNewJob,
    getJobs,
    getEvents,
    handleUpdateFollowers,
    getFollowers,
	getJobsByAuthor
};
