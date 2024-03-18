 const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 5500;


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Dakshboi@123',
  database: 'pocketpal',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());



app.post('/check', (req, res) => {
  const email = req.body.email;
  const checkSql = 'SELECT email FROM users WHERE email = ?';
  db.query(checkSql, [email], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.send('f');
    } else {
      res.send('s');
    }
  });
});
// forgot password
app.post('/checks', (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const checkSql = 'SELECT name FROM users WHERE email = ?';
  db.query(checkSql, [email], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      sendOTP(email, otp);
      console.log('f'+results[0].name);
      res.send('f'+results[0].name);
    } else {
      res.send('s');
    }
  });
});


app.post('/username', (req, res) => {
  const uname = req.body.username;
  const email = req.body.email;
  const otp = req.body.otp;
  const checkSql = 'SELECT name FROM users WHERE name = ?';
  db.query(checkSql, [uname], async (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.send('f');
    } else {
      sendOTP(email, otp)
      res.send('s');
    }
  });
});

app.post('/usernames', (req, res) => {
  const uname = req.body.username;
  console.log(uname);
  const checkSql = 'SELECT name FROM users WHERE name = ?';
  db.query(checkSql, [uname], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.send('f');
    } else {
      res.send('s');
    }
  });
});

app.post('/sign', (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const age = req.body.age;
    const balance = 0;
  
    const insertSql = 'INSERT INTO users (email, name, password, age, balance) VALUES (?, ?, ?, ?, ?)';
      db.query(insertSql, [email, username, password, age, balance], (err, result) => {
        if (err) {
           res.send(err);
        } else {
           res.send('s');
        }
      });
  });


app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    const loginSql = 'SELECT name FROM users WHERE email = ? AND password = ?';
    db.query(loginSql, [email, password], (err, results) => {
      if (err) throw err;
  
      if (results.length > 0) {
        res.send('s'+results[0].name);
      } else {
        res.send('f');
      }
    });
  });

app.post('/postbudget', (req, res) => {
  const email = req.body.email;
  const description = req.body.desc;
  const amt = parseFloat(req.body.amt);
  const date = req.body.date;
  const time = req.body.time;
  var total = 0;
  const sql = 'SELECT balance FROM users WHERE email = ?'
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.log("select")
      console.log(err);
      res.send('f');
    } else {
      total = (parseFloat(results[0].balance) - amt);
      const postsql = 'INSERT INTO expenditures (email, date, time, reason, amount, balance) VALUES (?, ?, ?, ?, ?, ?)'
      db.query(postsql, [email, date, time, description, amt, total], (err, postRes) => {
        if (err) {
          console.log("insert")
          console.log(err)
          res.send('f');
        } else {
          const post = 'UPDATE users SET balance = ? WHERE email = ?'
          db.query(post, [total, email], (err, updateRes) => {
            if(err) {
              console.log("update")
              console.log(err)
              res.send('f');
            } else {
              res.send('s');
            }
          });
        }
      })
    }
  })
})



app.post('/crd', (req, res) => {
  const email = req.body.email;
  const postsql = 'SELECT name, age, balance FROM users WHERE email = ?'
  db.query(postsql, [email], (err, results) => {
    if (err) {
      console.error("Error retrieving user details:", err);
      res.status(500).send("Error retrieving user details. Please try again later.");
    } else {
      res.send(results);
    }
  })
});


app.post('/updb', (req, res) => {
  var total = 0;
  const email = req.body.email;
  const chng = parseFloat(req.body.change);
  const sql = 'SELECT balance FROM users WHERE email = ?'
  db.query(sql, [email], (err, results) => {
    if (err) {
      res.send('f');
    } else {
      total = parseFloat(results[0].balance);
      const postsql = 'UPDATE users SET balance = ? WHERE email = ?'
  db.query(postsql, [(total+chng), email], (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.send('s');
    }
  })
    }
  })
})

app.post('/invest', (req, res) => {
  const date = req.body.date;
  const time = req.body.time;
  const email = req.body.email;
  const amt = parseFloat(req.body.amt);
  const type = req.body.name;
  const quant = parseFloat(req.body.quant);
  const total = amt * quant;
  const postsql = 'INSERT INTO investments (email, date, time, name, amt, quantity, total_amt) VALUES (?, ?, ?, ?, ?, ?, ?)'
  db.query(postsql, [email, date, time, type, amt, quant, total], (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.send('s');
    }
  })
})

app.post('/update-user', (req, res) => {
  const email = req.body.email;
const name = req.body.name;
const postsql = 'UPDATE users SET name = ? WHERE email = ?';
db.query(postsql, [name, email], (err, results) => {
  if (err) {
    console.log(err);
    res.send(err);
  } else {
    res.send('s');
  }
  })
    
})


async function sendOTP(email, otp) {
  let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'pocketpal95@gmail.com',
          pass: 'bpkz nddu kekw qunk' 
      }
  });

  let mailOptions = {
      from: 'pocketpal95@gmail.com',
      to: email,
      subject: 'OTP for Verification',
      text: `Your OTP is: ${otp}`
  };

  try {
      let info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return otp; 
  } catch (error) {
      console.error('Error occurred while sending email:', error);
      throw error;
  }
}

app.post('/send-otp', (req, res) => {
  const email = req.body.email; 
  sendOTP(email)
      .then(otp => {
          console.log('OTP sent successfully!'+ otp);
          res.send('OTP sent successfully');
      })
      .catch(error => {
          console.error('Failed to send OTP:', error);
          res.status(500).send('Failed to send OTP');
      });
});







app.post('/change-password', (req, res) => {
  const email = req.body.email;
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, currentPassword], (error, results) => {
    if (error) {
      console.error('Error querying database:', error);
      return res.json({ success: false, message: 'Error querying database' });
    }

    if (results.length === 0) {
      return res.json({ success: false, message: 'Incorrect current password or username' });
    }

    db.query('UPDATE users SET password = ? WHERE email = ?', [newPassword, email], (error) => {
      if (error) {
        console.error('Error updating password:', error);
        return res.json({ success: false, message: 'Error updating password' });
      }
      
      return res.json({ success: true });
    });
  });
});



app.get('/expenditures', (req, res) => {
  const email = req.query.email;

  if (!email) {
    res.status(400).send('Email parameter is required');
    return;
  }

  const sql = 'SELECT * FROM expenditures WHERE email = ?';

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error fetching expenditures: ', err);
      res.status(500).send('Error fetching expenditures');
      return;
    }

    res.json(results);
  });
});


app.get('/investments', (req, res) => {
  const email = req.query.email;

  if (!email) {
    res.status(400).send('Email parameter is required');
    return;
  }

  const sql = 'SELECT * FROM investments WHERE email = ?';

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error fetching expenditures: ', err);
      res.status(500).send('Error fetching expenditures');
      return;
    }

    res.json(results);
  });
});

app.get('/data', (req, res) => {

  const sql = 'SELECT * FROM savings_2023';

  db.query(sql, (error, results, fields) => {
    if (error) {
      res.status(500).send('Error fetching data from database');
    } else {
      const sql = '';
      db.query(sql)
      const data = results.map(row => {
        return {
          jan: row.jan,
          feb: row.feb,
          mar: row.mar,
          apr: row.apr,
          may: row.may,
          jun: row.jun,
          jul: row.jul,
          aug: row.aug,
          sep: row.sep,
          oct: row.oct,
          nov: row.nov,
          decm: row.decm
        };
      });

      console.log('Fetched data:', data);

      res.json(data);
    }
  });
});

app.get('/data1', (req, res) => {
  
  const sql = 'SELECT * FROM Balance_2023';

  db.query(sql, (error, results, fields) => {
    if (error) {
      res.status(500).send('Error fetching data from database');
    } else {
      const data = results.map(row => {
        return {
          jan: row.January,
          feb: row.February,
          mar: row.March,
          apr: row.April,
          may: row.May,
          jun: row.June,
          jul: row.July,
          aug: row.August,
          sep: row.September,
          oct: row.October,
          nov: row.November,
          decm: row.December
        };
      });

      console.log('Fetched data:', data);

      res.json(data);
    }
  });
});

app.get('/data2', (req, res) => {
  
  const sql = 'SELECT * FROM investments_2023';

  db.query(sql, (error, results, fields) => {
    if (error) {
      res.status(500).send('Error fetching data from database');
    } else {
      const data = results.map(row => {
        return {
          jan: row.jan,
          feb: row.feb,
          mar: row.mar,
          apr: row.apr,
          may: row.may,
          jun: row.jun,
          jul: row.jul,
          aug: row.aug,
          sep: row.sep,
          oct: row.oct,
          nov: row.nov,
          decm: row.decm
        };
      });

      console.log('Fetched data:', data);

      res.json(data);
    }
  });
});

app.get('/data3', (req, res) => {

  const sql = 'SELECT * FROM expenditures_2023';

  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send('Error fetching data from database');
    } else {
      const data = results.map(row => {
        return {
          id: row.id,
          email: row.email,
          jan: row.jan,
          feb: row.feb,
          mar: row.mar,
          apr: row.apr,
          may: row.may,
          jun: row.jun,
          jul: row.jul,
          aug: row.aug,
          sep: row.sep,
          oct: row.oct,
          nov: row.nov,
          decm: row.decm
        };
      });

      console.log('Fetched data:', data);

      res.json(data);
    }
  });
});



app.get('/generate-pie-chart', (req, res) => {
  const query = `
    SELECT name, SUM(total_amt) AS total_investment
    FROM investments
    WHERE email = 'pocketpal95@gmail.com'
    GROUP BY name;  
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const labels = results.map(result => result.name);
    const series = results.map(result => result.total_investment);

    const options = {
      series: series,
      chart: {
        width: '100%',
        heigth: '110%',
        type: 'pie',
      },
      labels: labels,
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            verticalAlign: 'middle',
            floating: false,
            fontSize: '14px',
            offsetX: 0,
            offsetY: 10,
          }
        }
      }]
    };

    res.json(options);
  });
});

app.get('/total', (req, res) => {
  db.query('SELECT * FROM expenditures_2023', (error, expenditureResults) => {
    if (error) throw error;

    db.query('SELECT * FROM savings_2023', (error, savingsResults) => {
      if (error) throw error;

      db.query('SELECT * FROM investments_2023', (error, investmentResults) => {
        if (error) throw error;

        let totalExpenditure = 0;
        let totalSavings = 0;
        let totalInvestments = 0;

        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'decm'];

        months.forEach(month => {
          totalExpenditure += parseFloat(expenditureResults[0][month]);
          totalSavings += parseFloat(savingsResults[0][month]);
          totalInvestments += parseFloat(investmentResults[0][month]);
        });

        console.log("total ex" +totalExpenditure)

        const series = {
          expend: totalExpenditure,
          saving: totalSavings,
          invest: totalInvestments
        };

        res.json(series);
      });
    });
  });
});

app.get('/generate-pie-chart2', (req, res) => {
  const query = `
    SELECT name, SUM(total_amt) AS total_investment
    FROM investments
    WHERE email = 'pocketpal95@gmail.com'
    GROUP BY name;  
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const labels = results.map(result => result.name);
    const series = results.map(result => result.total_investment);

    const options = {
      series: series,
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: labels,
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    res.json(options);
  });
});

app.post('/balance', (req, res) => {
  const email = req.body.email;
  const sql = 'SELECT age, balance FROM users WHERE email = ?';

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error fetching balance:', err);
      res.status(500).send('Error fetching balance');
      return;
    }
    const { age, balance } = results[0] || {};
    res.send('s' + balance + '+' + age);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
