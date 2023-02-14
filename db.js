const Sequelize = require('sequelize')
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_people_places_things')

const Person = conn.define('person', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
})

const Place = conn.define('place', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
})

const Thing = conn.define('thing', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
})

const Souvenir = conn.define('souvenir', {})

Souvenir.belongsTo(Person)
Souvenir.belongsTo(Place)
Souvenir.belongsTo(Thing)

const syncAndSeed = async() => {
    await conn.sync({force:true})
    const [moe, larry, lucy, ethyl] = await Promise.all ([
        Person.create({ name: 'moe' }),
        Person.create({ name: 'larry' }),
        Person.create({ name: 'lucy' }),
        Person.create({ name: 'ethyl' }),
    ])
    const [paris, nyc, chicago, london] = await Promise.all ([
        Place.create({ name: 'paris' }),
        Place.create({ name: 'nyc' }),
        Place.create({ name: 'chicago' }),
        Place.create({ name: 'london' }),
    ])
    const [hat, bag, shirt, cup] = await Promise.all ([
        Thing.create({ name: 'hat' }),
        Thing.create({ name: 'bag' }),
        Thing.create({ name: 'shirt' }),
        Thing.create({ name: 'cup' }),
    ])
    const souvenirs = await Promise.all ([
        Souvenir.create({personId: '1', thingId: '1', placeId: '3'}),
        Souvenir.create({personId: '1', thingId: '2', placeId: '1'}),
        Souvenir.create({personId: '4', thingId: '3', placeId: '2'})
    ])
}

module.exports = {
    conn,
    Person,
    Place,
    Thing,
    Souvenir,
    syncAndSeed
}