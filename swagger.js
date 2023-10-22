import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Andrew API',
            description: 'First Job APIs ',
            version: '1.0.0',
        },
    },
    // looks for configuration in specified directories
    apis: ["./DB/models/*.js","./modules/**/*.js",],
}

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app, port) {
    // Swagger Page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    // Documentation in JSON format
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}

export default swaggerDocs
