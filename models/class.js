const db = require('./../db');

var Class = {
  getById: (id) => {
    const query = `
      SELECT
        c.id,
        c.batch,
        c.section,
        u.id as adviser_id,
        u.first_name as adviser_first_name,
        u.last_name as adviser_last_name
      FROM classes c
      INNER JOIN users u on c.adviser = u.id
      WHERE c.id = ${id}
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
  getByStudentId: (studentId) => {
    const query = `
      SELECT 
        cl.batch,
        cl.section,
        u.first_name ,
        u.last_name,
        u.email,
        us.first_name as adviser_fname,
        us.last_name as adviser_lname,
        us.email as adviser_email,
        us.id as adviser_id,
        g.group_id
      FROM "classStudents" c
      INNER JOIN classes cl on c.class_id = cl.id
      INNER JOIN users u on c.student_id = u.id
      INNER JOIN users us on cl.adviser = us.id
      INNER JOIN group_members g on u.id = g.student_id
      WHERE c.student_id = ${studentId}
    `;
    var promise = new Promise((resolve, reject) => {
      db.query(query, (req, data) => {
        console.log('getByStudentId', data.rows);
        if (data && data.rowCount) {
          resolve(data.rows[0]);
        } else {
          resolve(null);
        }
      });
    });
    return promise;
  },
  getStudentsByClassId: (classId) => {
    const query = `
      SELECT *
      FROM "classStudents" c
      INNER JOIN users u on c.student_id = u.id
      WHERE c.class_id = ${classId}
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
  list: (filter) => {
    const query = `
      SELECT
        c.id,
        c.batch,
        c.section,
        u.id as adviser_id,
        u.first_name as adviser_first_name,
        u.last_name as adviser_last_name
      FROM classes c
      INNER JOIN users u on c.adviser = u.id
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
  listByFacultyId: (facultyId) => {
    const query = `
      SELECT
        id,
        batch,
        section
      FROM classes 
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
  create: (data) => {
    // check first if user with given email already exists
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        INSERT INTO classes(batch, section, adviser)
        VALUES (
          '${data.batch}',
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
  addStudents: (classId, studentIds) => {
    console.log('addStudents', classId, studentIds);
    const promise = new Promise((resolve, reject) => {

      var values = [];
      studentIds.forEach((studentId) => {
        values.push(`('${classId}', '${studentId}')`)
      })
      var query = `
        INSERT INTO "classStudents"(class_id, student_id)
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
  }
};
module.exports = Class;
