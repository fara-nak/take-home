import express from 'express'
import path from 'path'
import router from './routes/laborCostRoutes.js'
import insertData from './models/populateData.js'

const app = express()
const port = process.env.PORT || 3000

async function setup() {
    app.use(express.json())

    // we can set a prefix for all other pages in router or just leave it as is
    app.use('/', router)

    // just for fun :)
    app.use('/assets', express.static(path.join('./', 'assets')))
    app.get('/', (req, res) => {
        res.send(`
      <h1>Welcome to Limble CMMS demo :)</h1>
      <img src="/assets/limble.png" alt="Limble Image"></img>`)
    })
}

// Starting the server, listening to the defined port
async function startServer() {
    app.listen(port, '0.0.0.0', () => {
        console.info(`App listening on ${port}.`)
    })
}

setup()

// This is for the time we have integration test and don't need to use actual server
if (process.env.NODE_ENV !== 'test') {
    insertData()
    startServer()
}

export default app
