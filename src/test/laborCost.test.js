import request from 'supertest'
import app from '../index.js'
import laborCostModel from '../models/laborCostModel.js'
import db from '../config/dbConfig.js'

describe('GET /worker', () => {
    let fetchCostByWorkerStub

    beforeEach(() => {
        fetchCostByWorkerStub = jest
            .spyOn(laborCostModel, 'fetchCostByWorker')
            .mockResolvedValue([{ worker_id: [1, 2], cost: 200 }])
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    afterAll(async () => {
        await db.end()
    })
    test('should fetch cost data by worker IDs', async () => {
        const response = await request(app).get(
            '/worker?workerIds=2&isComplete=true'
        )
        expect(response.status).toBe(200)
        expect(response.body).toEqual([{ worker_id: [1, 2], cost: 200 }])
    })

    test('should handle errors gracefully', async () => {
        fetchCostByWorkerStub.mockRejectedValue(
            new Error('Error fetching data')
        )
        const response = await request(app).get(
            '/worker?workerIds=1,2&isComplete=123'
        )
        expect(response.status).toBe(400)
        expect(response.body.errors).toEqual([
            {
                msg: 'isComplete must be a boolean',
                location: 'query',
                value: '123',
                path: 'isComplete',
                type: 'field'
            }
        ]);
    })
})

describe('GET /location', () => {
    let fetchCostByLocationStub

    beforeEach(() => {
        fetchCostByLocationStub = jest
            .spyOn(laborCostModel, 'fetchCostByLocation')
            .mockResolvedValue([{ location: [1, 2], total_labor_cost: 1500 }])
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    test('should fetch cost data by location IDs', async () => {
        const response = await request(app).get(
            '/location?locationIds=1,2&isComplete=false'
        )
        expect(response.status).toBe(200)
        expect(response.body).toEqual([
            { location: [1, 2], total_labor_cost: 1500 },
        ])
    })

    test('should handle errors gracefully', async () => {
        fetchCostByLocationStub.mockRejectedValue(
            new Error('Error fetching data')
        )
        const response = await request(app).get(
            '/location?locationIds=12&isComplete=123'
        )
        expect(response.status).toBe(400)
        expect(response.body.errors).toEqual([
            {
                msg: 'isComplete must be a boolean',
                location: 'query',
                value: '123',
                path: 'isComplete',
                type: 'field'
            }
        ]);
    });
})
