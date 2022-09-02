const {Pool} = require('pg')

const pool = new Pool({
    connectionString: "postgres://yhictkchkrrztq:34dc27504fc038d786f7384cc14a21b1de75615e8b21a9a8970e2b0a43265d68@ec2-44-209-158-64.compute-1.amazonaws.com:5432/dab5e5oc375arb",
    ssl: {
        rejectUnauthorized: false
      }
})

async function ResetDb() {
    pool.connect(async function (err, client, done) {
      client.query("DROP TABLE IF EXISTS ")
    })
}