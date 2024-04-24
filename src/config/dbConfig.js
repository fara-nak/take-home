import * as mariadb from 'mariadb'

const db = mariadb.createPool({
    host: process.env['DATABASE_HOST'],
    user: process.env['DATABASE_USER'],
    password: process.env['DATABASE_PASSWORD'],
    database: process.env['DATABASE_NAME'],
})

export default db
