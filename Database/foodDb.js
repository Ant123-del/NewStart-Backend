const {Pool} = require('pg')
const uniqid = require('uniqid')
const pool = new Pool({
    connectionString: "postgres://yhictkchkrrztq:34dc27504fc038d786f7384cc14a21b1de75615e8b21a9a8970e2b0a43265d68@ec2-44-209-158-64.compute-1.amazonaws.com:5432/dab5e5oc375arb",
    ssl: {
        rejectUnauthorized: false
      }
})

async function ResetDb() {
    pool.connect(async function (err, client, done) {
      client.query("DROP TABLE IF EXISTS Food");
      client.query("CREATE TABLE Food (account_id TEXT, id TEXT, meal_name TEXT, substance TEXT, time DATE)")
      done()
    })
}

async function LogFood(account_id, meal_name, substance) {
  pool.connect(async function (err, client, done) {
    client.query('INSERT INTO Food (account_id, id, meal_name, substance, time) VALUES ($1, $2, $3, $4, CURRENT_DATE)',
    [account_id, uniqid(), meal_name, substance])
    done()
  })
}

async function getFoodLogsByAccountId(id) {
  return new Promise((resolve, reject) => {
    pool.connect(async function(err, client, done) {
      client.query("SELECT * FROM Food WHERE account_id=$1", [id], (err, results) => {
      if(err) reject(err)
      const {rows} = results
      resolve(rows)
      done()
    })
    }
    )
  })
}

async function getFoodLogsByAccountName(name) {
  return new Promise((resolve, reject) => {
    pool.connect(async function(err, client, done) {
      client.query("SELECT * FROM Food JOIN Account ON Food.account_id = Account.id WHERE Account.username = $1", [name],
      (err, results) => {
        if(err) reject(err)
        const {rows} = results
        resolve(rows)
        done()
      })
    })
  })
}

async function getFoodLogById(id) {
  return new Promise((resolve, reject) => {
    pool.connect(async function(err, client, done) {
      client.query('SELECT * FROM Food WHERE id=$1', [id], (err, results) => {
        if(err) reject(err)
        const {rows} = results
        resolve(rows[0])
        done()
      })
    })
  })
}

async function deleteFoodLogById(id) {
  pool.connect(async function(err, client, done) {
    client.query('DELETE FROM Food WHERE id=$1', [id])
    done()
  })
}


module.exports = {
  LogFood,
  getFoodLogsByAccountId,
  getFoodLogsByAccountName,
  getFoodLogById,
  deleteFoodLogById
}