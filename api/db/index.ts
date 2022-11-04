import { Sequelize, Dialect } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const dbDatabase = process.env.DB_DATABASE as string;
const dbUsername = process.env.DB_USERNAME as string;
const dbHost = process.env.DB_HOST;
const dbDialect = process.env.DB_DIALECT as Dialect;
const dbPort: number = parseInt(process.env.DB_PORT as string);
const dbPassword = process.env.DB_PASSWORD;

const db = new Sequelize(dbDatabase, dbUsername, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect
});

export default db;

// import { Sequelize } from 'sequelize';
// const db = new Sequelize("TrabalhoCrudReact", "postgres", "JediSupremo", {
//   host: "177.44.248.60",
//   port: 5432,
//   dialect: "postgres"
// });

// async function testandoDatabase() {
//   try {
//       await db.authenticate();
//       console.log('tudo certo')
//   } catch (ERRO) {
//       console.log(' Erro ' + ERRO)
//   }
// }
// testandoDatabase();

// // db.sync();
// export default db;