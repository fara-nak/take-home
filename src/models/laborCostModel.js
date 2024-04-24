import db from '../config/dbConfig.js'
import createCustomResponse from '../errors/errorHandling.js'

const fetchCostByWorker = async (workerIds, isComplete) => {
    let connection
    let params = []
    try {
        connection = await db.getConnection()

        // Handling sql injection security issue by seperating queries and passing params as an array
        let taskSql = `SELECT id FROM tasks`
        if (isComplete != undefined) {
            taskSql += ` WHERE is_complete = ?`
            params.push(isComplete)
        }

        // Actual query to calculate cost and filter it based on workIds and isCompleted params
        const sql = `
            WITH t AS ( ${taskSql} ),
            w AS (
                SELECT id, hourly_wage
                FROM workers
                WHERE id in (?)
            )
            SELECT worker_id, SUM(hourly_wage * (time_seconds/3600)) AS cost
            FROM logged_time
            JOIN t ON logged_time.task_id = t.id
            JOIN w ON logged_time.worker_id = w.id
            GROUP BY worker_id`
        params.push(workerIds)
        return await connection.query(sql, params)
    } catch (error) {
        throw createCustomResponse(error, 'failed to run fetchCostByWorker')
    } finally {
        if (connection) connection.release() // Releasing all connection after we're done with database
    }
}

const fetchCostByLocation = async (locationIds, isComplete) => {
    let connection
    let params = []

    // Handling sql injection security issue by seperating queries and passing params as an array
    let taskFilterSQL = `
            SELECT 
                tasks.location_id,
                logged_time.worker_id,
                logged_time.time_seconds
            FROM 
                logged_time
            INNER JOIN 
                tasks ON logged_time.task_id = tasks.id
            WHERE 
                tasks.location_id IN (?)
        `
    params.push(locationIds)
    if (isComplete !== undefined) {
        taskFilterSQL += ` AND tasks.is_complete = ?`
        params.push(isComplete)
    }
    try {
        connection = await db.getConnection()
        // Actual query to calculate cost and filter it based on locationIds and isCompleted params
        const sql = `
            WITH TaskLaborCost AS (${taskFilterSQL}),
            WorkerWages AS (
                SELECT 
                    id,
                    hourly_wage
                FROM workers
            ),
            LaborCostPerLocation AS (
                SELECT 
                    locations.name AS location,
                    SUM(tlc.time_seconds / 3600 * ww.hourly_wage) AS total_labor_cost
                FROM TaskLaborCost tlc
                INNER JOIN WorkerWages ww ON tlc.worker_id = ww.id
                INNER JOIN locations ON tlc.location_id = locations.id
                GROUP BY locations.name
            )
            SELECT 
                location,
                total_labor_cost
            FROM LaborCostPerLocation`
        return await connection.query(sql, params)
    } catch (error) {
        throw createCustomResponse(error, 'failed to run fetchCostByLocation')
    } finally {
        if (connection) connection.release() // Releasing all connection after we're done with database
    }
}

export default { fetchCostByWorker, fetchCostByLocation }
