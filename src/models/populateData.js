import db from '../config/dbConfig.js'

async function insertData() {
    let conn
    try {
        conn = await db.getConnection()
        await dropDatabas(conn)
        await insertLocations(conn)
        await insertWorkers(conn)
        await insertTasks(conn)
        await insertLoggedTime(conn)
        console.log('Data generation complete!')
    } catch (err) {
        console.error(err)
    } finally {
        // making sure all the connections are released so it won't time out or misuse the database
        if (conn) conn.release()
    }
}
// For testing purpose and prevent getting duplication error while re-running the app
async function dropDatabas(conn) {
    const tables = ['locations', 'tasks', 'workers', 'logged_time']
    for (let table of tables) {
        await conn.query(`DELETE FROM ${table}`)
    }
}

async function insertLocations(conn) {
    const locations = [
        'Warehouse',
        'Main Office',
        'Remote Site',
        'Factory Floor',
        'Research Lab',
    ]
    for (let location of locations) {
        await conn.query('INSERT INTO locations (name) VALUES (?)', [location])
    }
}

async function insertWorkers(conn) {
    const workers = [
        { username: 'johndoe', hourly_wage: 15.5 },
        { username: 'janedoe', hourly_wage: 17.75 },
        { username: 'samsmith', hourly_wage: 16.0 },
        { username: 'emilywhite', hourly_wage: 18.25 },
    ]
    for (let worker of workers) {
        await conn.query(
            'INSERT INTO workers (username, hourly_wage) VALUES (?, ?)',
            [worker.username, worker.hourly_wage]
        )
    }
}
// Added a new col for "is_complete" to be able to provide filtering for completed tasks vs incompleted
async function insertTasks(conn) {
    const tasks = [
        {
            description: 'Inventory Management',
            is_complete: true,
            location_id: 1,
        },
        {
            description: 'Routine Maintenance',
            is_complete: false,
            location_id: 2,
        },
        {
            description: 'Quality Assurance',
            is_complete: false,
            location_id: 3,
        },
    ]
    for (let task of tasks) {
        await conn.query(
            'INSERT INTO tasks (description, is_complete, location_id) VALUES (?, ?, ?)',
            [task.description, task.is_complete, task.location_id]
        )
    }
}

async function insertLoggedTime(conn) {
    const logs = [
        { time_seconds: 3600, task_id: 1, worker_id: 1 },
        { time_seconds: 1800, task_id: 2, worker_id: 2 },
        { time_seconds: 7200, task_id: 3, worker_id: 3 },
    ]
    for (let log of logs) {
        await conn.query(
            'INSERT INTO logged_time (time_seconds, task_id, worker_id) VALUES (?, ?, ?)',
            [log.time_seconds, log.task_id, log.worker_id]
        )
    }
}

export { insertData as default }
