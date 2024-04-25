import express from 'express'
import { query, validationResult } from 'express-validator'
import {
    getCostByWorker,
    getCostByLocation,
} from '../controllers/laborCostController.js'

const router = express.Router()

// Using express-validator here to ensure we have correct query params to pass
router.get(
    '/worker',
    [
        query('workerIds')
            .exists()
            .withMessage('Worker IDs are required')
            .isString()
            .withMessage(
                'Worker IDs should be a string of comma-separated numbers'
            )
            .matches(/^(\d+,)*\d+$/)
            .withMessage(
                'Worker IDs must be a comma-separated list of numbers'
            ),
        query('isComplete')
            .optional()
            .isBoolean()
            .withMessage('isComplete must be a boolean')
            .toBoolean(),
    ],
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next() // Proceed to the next middleware/function if validation passes
    },
    getCostByWorker
)

router.get(
    '/location',
    [
        query('locationIds')
            .exists()
            .withMessage('Location IDs are required')
            .isString()
            .withMessage(
                'Location IDs should be a string of comma-separated numbers'
            )
            .matches(/^(\d+,)*\d+$/)
            .withMessage(
                'Location IDs must be a comma-separated list of numbers'
            ),
        query('isComplete')
            .optional()
            .isBoolean()
            .withMessage('isComplete must be a boolean')
            .toBoolean(),
    ],
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next() // Proceed to the next middleware/function if validation passes
    },
    getCostByLocation
)

export default router
