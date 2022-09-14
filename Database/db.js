const {Pool} = require('pg')
const uniqid = require('uniqid')
const foodDb = require('./foodDb')
const pool = new Pool({
    connectionString: "postgres://yhictkchkrrztq:34dc27504fc038d786f7384cc14a21b1de75615e8b21a9a8970e2b0a43265d68@ec2-44-209-158-64.compute-1.amazonaws.com:5432/dab5e5oc375arb",
    ssl: {
        rejectUnauthorized: false
      }
})

async function ResetDb() {
  pool.connect(async function (err, client, done) {
    client.query("DROP TABLE IF EXISTS Account");
    client.query("CREATE TABLE Account (id TEXT, email TEXT, username TEXT PRIMARY KEY, password TEXT)")
    done()
  })
}

async function registerAccount(email, username, password) {
  pool.connect(async function (err, client, done) {
    const id = uniqid()
    client.query("INSERT INTO Account (id, email, username, password) VALUES ($1, $2, $3, $4)", 
    [id, email, username, password])
    done()
  })
}

async function getUserByName(name) {
  return new Promise((resolve, reject) => {
    pool.connect(async function(err, client, end) {
      client.query("SELECT * FROM Account WHERE username=$1", [name], (err, result) => {
        if(err) reject(err)
        const {rows} = result
        resolve(rows[0])
        end()
      })
    })
  })
}

async function getUserById(id) {
  return new Promise((resolve, reject) => {
    pool.connect(async function(err, client, end) {
      client.query("SELECT * FROM Account WHERE id=$1", [id], (err, result) => {
        if(err) reject(err)
        const {rows} = result
        resolve(rows[0])
        end()
      })
    })
  })
}

async function deleteUserById(id) {
  pool.connect(async function (err, client, done) {
    client.query("DELETE FROM Account WHERE id = $1", [id])
    done()
  })
}

module.exports = {
  registerAccount,
  getUserByName,
  getUserById,
  deleteUserById,
}