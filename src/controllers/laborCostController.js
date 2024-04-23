import laborCostModel from '../models/laborCostModel.js'

const getCostByWorker = async (req, res) => {
    try {
        const { workerIds, isComplete } = req.query;
        const rows = await laborCostModel.fetchCostByWorker(workerIds.split(','), isComplete);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data by worker", error });
    }
};

const getCostByLocation = async (req, res) => {
    try {
        const { locationIds, isComplete } = req.query;
        const rows = await laborCostModel.fetchCostByLocation(locationIds.split(','), isComplete);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data by location", error });
    }
};

export { getCostByWorker, getCostByLocation };

