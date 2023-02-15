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

const Souvenir = conn.define('souvenir', {
    count: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    purchasedOn: {
        type: Sequelize.DATE,
        defaultValue: new Date()
    }
})

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
        Souvenir.create({personId: moe.id, thingId: hat.id, placeId: london.id, count: 2}),
        Souvenir.create({personId: moe.id, thingId: bag.id, placeId: paris.id, count: 3}),
        Souvenir.create({personId: ethyl.id, thingId: shirt.id, placeId: nyc.id})
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