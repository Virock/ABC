'use strict'
const mongoose = require('mongoose');
const Role = require('../models/Role');

async function insertIntoDatabase() {

    mongoose.connect("mongodb://DESKTOP-P2ELC2L:27017,DESKTOP-P2ELC2L:27018,DESKTOP-P2ELC2L:27019/ABC", {
        useCreateIndex: true,
        useNewUrlParser: true,
        replicaSet: 'rs'
    });

    const act_poster = new Role({
        name: "Act Poster"
    })

    const reward_provider = new Role({
        name: "Reward Provider"
    })

    const manager = new Role({
        name: "Manager"
    })

    const admin = new Role({
        name: "Administrator"
    })

    const promises = [act_poster.save(), reward_provider.save(), manager.save(), admin.save()];
    await Promise.all(promises);

    await mongoose.disconnect();
}

insertIntoDatabase();