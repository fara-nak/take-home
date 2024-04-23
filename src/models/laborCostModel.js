import db from "../config/dbConfig.js";

const fetchCostByWorker = async (workerIds, isComplete) => {
  let connection;
  try {
    connection = await db.getConnection();
    let taskSql = `SELECT id FROM tasks`;
    if (isComplete != undefined) {
      taskSql += ` WHERE is_complete = ${isComplete}`;
    }
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
            GROUP BY worker_id`;

    return await connection.query(sql, [workerIds], (err, results) => {
      console.log(err);
      console.log(results);
    });
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

const fetchCostByLocation = async (locationIds, isComplete) => {
  let connection;
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
        `;

  // Append the completion condition if isComplete is not undefined
  if (isComplete !== undefined) {
    taskFilterSQL += ` AND tasks.is_complete = ${isComplete}`;
  }
  try {
    connection = await db.getConnection();
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
            FROM LaborCostPerLocation`;
    const results = await connection.query(sql, [locationIds]);
    return results;
  } catch (error) {
    console.error("error:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

export default { fetchCostByWorker, fetchCostByLocation };
