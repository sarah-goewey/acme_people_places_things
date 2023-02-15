const express = require('express')
const app = express()
const { conn, Person, Place, Thing, Souvenir, syncAndSeed } = require('./db');

app.use(express.urlencoded({extended: false})) 
app.use(require('method-override')('_method'))


app.get('/', async(req, res, next) => {
    const [people, places, things, souvenirs] = await Promise.all ([
        Person.findAll(),
        Place.findAll(),
        Thing.findAll(),
        Souvenir.findAll({include: [Person, Place, Thing]})
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
                <h2>Souvenir Purchases</h2>
                <ul>
                    ${
                        souvenirs.map(souvenir => `
                        <li>
                            ${souvenir.person.name} purchased ${souvenir.count} ${souvenir.thing.name}(s) in ${souvenir.place.name} on ${souvenir.purchasedOn}
                            <form method='POST' action='/${souvenir.id}?_method=DELETE'>
                                <button>
                                Delete 
                                </button>
                            </form>
                        </li>`).join('')
                    }
                </ul>
                <form method='POST'>
                    <h2>Add Souvenir</h2>
                    <p>Create a new Souvenir Purchase by selecting a Person, the Place they purchased the souvenir, and the Thing they bought.</p>
                    <select name='personId'>
                        <option value=''>--Select Person--</option>
                    ${
                        people.map( person => {
                        return `
                            <option value=${person.id}>
                            ${ person.name }
                            </option>
                        `;
                        }).join('')
                    }
                    </select>
                    <select name='placeId'>
                        <option value=''>--Select Place--</option>
                    ${
                        places.map( place => {
                        return `
                            <option value=${place.id}>
                            ${ place.name }
                            </option>
                        `;
                        }).join('')
                    }
                    </select>
                    <select name='thingId'>
                        <option value=''>--Select Thing--</option>
                    ${
                        things.map( thing => {
                        return `
                            <option value=${thing.id}>
                            ${ thing.name }
                            </option>
                        `;
                        }).join('')
                    }
                    </select>
                    <button>Create</button>
                </form>
            </body>
        </html>
        `)
    }
    catch(ex) {
        next(ex)
    }
})

app.post ('/', async(req, res, next) => {
    if (!req.body.personId || !req.body.placeId || !req.body.thingId) {
        res.send('Please make 3 valid selections to create a souvenir purchase. <a href="/">Try Again</a>')
    }
    try {
        await Souvenir.create({personId: req.body.personId, thingId: req.body.thingId, placeId: req.body.placeId})
        res.redirect('/')
    }
    catch(ex) {
        next(ex)
    }
})

app.delete('/:id', async(req,res,next) => {
    try {
        const souvenir = await Souvenir.findByPk(req.params.id)
        await souvenir.destroy()
        res.redirect('/')
    }
    catch(ex) {
        next(ex)
    }
})

const port = process.env.PORT || 3000

app.listen(port, async()=> {
    await syncAndSeed()
    console.log(`listening on port ${port}`)
})