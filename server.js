const express = require('express')
const app = express()
const { conn, Person, Place, Thing, Souvenir, syncAndSeed } = require('./db');

app.get('/', async(req, res, next) => {
    const [people, places, things] = await Promise.all ([
        Person.findAll(),
        Place.findAll(),
        Thing.findAll()
    ])
    try {
        res.send(`
        <html>
            <head>
            </head>
            <body>
                <h1>Acme People, Places and Things</h1>
                <h2>People</h2>
                <ul>
                    ${
                        people.map(person => `<li>${person.name}</li>`).join('')
                    }
                </ul>
                <h2>Places</h2>
                <ul>
                    ${
                        places.map(place => `<li>${place.name}</li>`).join('')
                    }
                </ul>
                <h2>Things</h2>
                <ul>
                    ${
                        things.map(thing => `<li>${thing.name}</li>`).join('')
                    }
                </ul>
            </body>
        </html>
        `)
    }
    catch(ex) {
        next(ex)
    }
})
const port = process.env.PORT || 3000
app.listen(port, async()=> {
    await syncAndSeed()
    const souvenirs = await Souvenir.findAll()
    console.log(souvenirs)
    console.log(`listening on port ${port}`)
})