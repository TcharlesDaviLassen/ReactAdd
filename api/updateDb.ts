import dotenv from 'dotenv';
dotenv.config();
import db from './db';
import User from './models/User';

async function atualizaDb() {
    // await User.sync({ force: true });
    await User.create({
        name: "Mateus",
        password: "12345",
        email: "mateus@mateus.com",
        age: 24,
        sex: "M"
    });

    let logged = await User.locateUser('mateus@mateus.com', '12345');
    console.log(logged?.toJSON());
}

atualizaDb();