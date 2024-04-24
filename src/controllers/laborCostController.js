import createCustomResponse from '../errors/errorHandling.js'
import laborCostModel from '../models/laborCostModel.js'

// Get response back from the api call and split workerIds and send it over to the actual function to query the db
const getCostByWorker = async (req, res) => {
    try {
        const { workerIds, isComplete } = req.query
        const rows = await laborCostModel.fetchCostByWorker(
            workerIds.split(','),
            isComplete
        )
        res.json(rows)
    } catch (error) {
        createCustomResponse(
            res.status(500),
            'fetching data by worker: ' + error
        )
    }
}

// Get response back from the api call and split locationIds and send it over to the actual function to query the db
const getCostByLocation = async (req, res) => {
    try {
        const { locationIds, isComplete } = req.query
        const rows = await laborCostModel.fetchCostByLocation(
            locationIds.split(','),
            isComplete
        )
        res.json(rows)
    } catch (error) {
        createCustomResponse(
            res.status(500),
            'fetching data by location: ' + error
        )
    }
}

export { getCostByWorker, getCostByLocation }
