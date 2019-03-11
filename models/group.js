const db = require('./../db');

var Group = {

  getById: (id) => {
    const query = `
      SELECT
        g.id,
        g.name,
        g.section,
        u.id as adviser_id,
        u.first_name as adviser_first_name,
        u.last_name as adviser_last_name
      FROM groups g
      INNER JOIN users u on g.adviser = u.id
      WHERE g.id = ${id}
    `;
    var promise = new Promise((resolve, reject) => {
      db.query(query, (req, data) => {
        if (data && data.rowCount) {
          resolve(data.rows[0]);
        } else {
          resolve(null);
        }
      });
    });
    return promise;
  },

  // add addStudents function
  addStudents: (groupId, studentIds) => {
    console.log('addStudents', groupId, studentIds);
    const promise = new Promise((resolve, reject) => {

      var values = [];
      studentIds.forEach((studentId) => {
        values.push(`('${groupId}', '${studentId}')`)
      })
      var query = `
        INSERT INTO group_members(group_id, student_id)
        VALUES ${values.join(',')}
        RETURNING *
      `;
      console.log('query', query);
      db.query(query, (req, data) => {
        console.log('added', req, data);
        resolve(data.rows);
      });
    });
    return promise;
  },

  listByFacultyId: (facultyId) => {
    const query = `
      SELECT
        id,
        name,
        section
      FROM groups
      WHERE adviser=${facultyId}
    `;
    var promise = new Promise((resolve, reject) => {
      console.log('query', query)
      db.query(query, (req, data) => {
        console.log('req', req)
        if (data && data.rowCount) {
          resolve(data.rows);
        } else {
          resolve([]);
        }
      });
    });
    return promise;
  },

  getStudentsByGroupId: (groupId) => {
    const query = `
      SELECT *
      FROM group_members g
      INNER JOIN users u on g.student_id = u.id
      WHERE g.group_id = ${groupId}
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

  getMembersByStudentId: (studentId) => {
    const query = `
      SELECT *
      FROM group_members g
      INNER JOIN users u on g.student_id = u.id
      INNER JOIN groups on g.group_id = groups.id
      WHERE g.group_id = (
        SELECT group_id
        FROM group_members
        WHERE student_id = ${studentId}
      )
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

  create: (data) => {
    // check first if user with given email already exists
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        INSERT INTO groups(name, section, adviser)
        VALUES (
          '${data.name}',
          '${data.section}',
          '${data.adviser}'
        )
        RETURNING *
      `;
      db.query(createQuery, (req, data) => {
        console.log('req', req);
        console.log('created', data);
        resolve(data.rows[0]);
      });
    });
    return promise;
  },

  deleteMember: (studentId) => {
    // check first if user with given email already exists
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        DELETE FROM group_members
        WHERE student_id = ${studentId}
      `;
      db.query(createQuery, (req, data) => {
        console.log('req', req);
        console.log('created', data);
        resolve(data.rows[0]);
      });
    });
    return promise;
  },

  // create function to insert thesisID to group
  insertThesisId: (thesisId, groupId) => {
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        UPDATE groups
        SET thesis_id = ${thesisId}
        WHERE id = ${groupId}
        RETURNING *
      `;
      db.query(createQuery, (req, data) => {
        console.log('req', req);
        console.log('created', data);
        resolve(data.rows[0]);
      });
    });
    return promise;
  },

  checkThesisIdIfNull: (groupId) => {
    const query = `
      SELECT 
        g.thesis_id
      FROM groups g
      WHERE g.id = ${groupId}
    `;
    var promise = new Promise((resolve, reject) => {
      db.query(query, (req, data) => {
        console.log('req', req)
        console.log('data', data)
        if (data && data.rowCount) {
          resolve(data.rows);
        } else {
          resolve([]);
        }
      });
    });
    return promise;
  }


};

module.exports = Group;