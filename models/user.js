const db = require('./../db');

function getByEmail(email, callback) {
  const query = `
      SELECT *
      FROM users
      WHERE email = '${email}'
    `;
  db.query(query, (req, data) => {
    if (data && data.rowCount) {
      callback(data.rows[0]);
    } else {
      callback();
    }
  });
};
var User = {
  getByEmail: (email, callback) => {
    getByEmail(email, callback);
  },
  getById: (userId, callback) => {
    const query = `
      SELECT *
      FROM users
      WHERE id = '${userId}'
    `;
    db.query(query, (req, data) => {
      if (data.rowCount) {
        callback(data.rows[0]);
      } else {
        callback();
      }
    });
  },
  list: (filter) => {
    const query = `
      SELECT *
      FROM users
      WHERE user_type = '${filter}'
    `;
    var promise = new Promise((resolve, reject) => {
      db.query(query, (req, data) => {
        if (data && data.rowCount) {
          resolve(data.rows);
        } else {
          resolve([]);
        }
      });
    });
    return promise;
  },
  noClassList: () => {
    const query = `
      SELECT *
      FROM users
      WHERE user_type = 'student' AND id NOT IN (SELECT DISTINCT student_id FROM "classStudents")
    `;
    var promise = new Promise((resolve, reject) => {
      db.query(query, (req, data) => {
        if (data && data.rowCount) {
          resolve(data.rows);
        } else {
          resolve([]);
        }
      });
    });
    return promise;
  },
  noGroupList: () => {
    const query = `
      SELECT *
      FROM users
      WHERE user_type = 'student' AND id NOT IN (SELECT DISTINCT student_id FROM group_members)
    `;
    var promise = new Promise((resolve, reject) => {
      db.query(query, (req, data) => {
        if (data && data.rowCount) {
          resolve(data.rows);
        } else {
          resolve([]);  
        }
      });
    });
    return promise;
  },  

  // create no committee list

  notCommitteeList: () => {
    const query = `
      SELECT *
      FROM users
      WHERE user_type = 'faculty' AND id NOT IN (SELECT DISTINCT faculty_id FROM committee_members)
    `;
    var promise = new Promise((resolve, reject) => {
      db.query(query, (req, data) => {
        if (data && data.rowCount) {
          resolve(data.rows);
        } else {
          resolve([]);
        }
      });
    });
    return promise;
  },

  listCommittee: () => {
    const query = `
      SELECT *
      FROM users
      WHERE user_type = 'faculty' AND id IN (SELECT DISTINCT faculty_id FROM committee_members)
    `;
    var promise = new Promise((resolve, reject) => {
      db.query(query, (req, data) => {
        if (data && data.rowCount) {
          resolve(data.rows);
        } else {
          resolve([]);
        }
      });
    });
    return promise;
  },
  
  create: (userData, type) => {
    // check first if user with given email already exists
    const promise = new Promise((resolve, reject) => {

      getByEmail(userData.email, function (user) {
        if (user) {
          resolve(user);
        } else {
          var createQuery = `
            INSERT INTO users(first_name, last_name, email, phone, password, user_type, is_admin, student_number)
            VALUES (
              '${userData.first_name}',
              '${userData.last_name}',
              '${userData.email}',
              '${userData.phone}',
              '${userData.password}',
              '${userData.user_type}',
              '${userData.is_admin ? true : false}',
              '${userData.student_number || ''}'
            )
            RETURNING *
          `;
          db.query(createQuery, (req, data) => {
            console.log('req', req);
            console.log('created', data);
            resolve(data.rows[0]);
          });
        }
      });
    });
    return promise;
  },
};
module.exports = User;
