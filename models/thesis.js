const db = require('./../db');

var Thesis = {
  create: (userData) => {
    // base it on create users
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        INSERT INTO thesis(title, abstract, group_id, year, adviser_id, adviser_approved, adviser_rejected, committee_approved, for_defense, final_verdict)
        VALUES (
          '${userData.title}',
          '${userData.abstract}',
          '${userData.group_id}',
          '${userData.year}',
          '${userData.adviser_id}',
          '${userData.adviser_approved ? true : false}',
          '${userData.adviser_rejected ? true : false}',
          '${userData.committee_approved ? true : false}',
          '${userData.for_defense? true : false}',
          '${userData.final_verdict? true : false}'
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

  listByGroupId: (groupId) => {
    const query = `
      SELECT *
      FROM thesis
      WHERE group_id=${groupId}
      ORDER BY adviser_approved DESC,
      adviser_rejected ASC,
      committee_approved DESC,
      id ASC
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

  list: () => {
    const query = `
      SELECT * FROM thesis
      ORDER BY adviser_approved DESC,
      adviser_rejected ASC,
      committee_approved DESC,
      id ASC
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

  listByAdviserId: (adviserId) => {
    const query = `
      SELECT *
      FROM thesis
      WHERE adviser_id = ${adviserId} AND
      adviser_rejected = 'false' AND
      adviser_approved = 'false'
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

  adviserApproved: (thesisId) => {
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        UPDATE thesis
        SET adviser_approved = true
        WHERE id = ${thesisId}
        RETURNING *;
      `;
      var createQuery2 = `
        INSERT INTO committee_approval(thesis_id)
        VALUES ('${thesisId}');
      `;
      db.query(createQuery, (req, data) => {
        console.log('req', req);
        console.log('created', data);
        resolve(data.rows[0]);
      });
      db.query(createQuery2, (req, data) => {
        console.log('req', req);
        console.log('created', data);
        resolve(data.rows[0]);
      });
    });
    return promise;
  },

  adviserRejected: (thesisId) => {
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        UPDATE thesis
        SET adviser_rejected = true
        WHERE id = ${thesisId}
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
//  continue meeeee------------------------
  listForCommitteeApproval: (userId) => {
    const query = `
      SELECT
        t.id,
        t.title,
        t.adviser_approved
      FROM thesis t
      WHERE t.adviser_approved = true
      AND t.id NOT IN (
        SELECT 
          t.id
        FROM thesis t 
        FULL OUTER JOIN members_done m ON t.id = m.thesis_id 
        WHERE t.adviser_approved = true
        AND m.committee_id = ${userId}
      )
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

  checkCommitteeApprovalCount: (thesisId) => {
    const query = `
      SELECT 
        c.thesis_id,
        c.member_approval
      FROM committee_approval c
      WHERE c.thesis_id = ${thesisId}
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
  },

//complete

  committeeApprovedComplete: (thesisId) => {
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        UPDATE thesis
        SET committee_approved = true
        WHERE id = ${thesisId}
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


  committeeApproved: (thesisId, userId) => {
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        UPDATE committee_approval
        SET member_approval = member_approval + 1
        WHERE thesis_id = ${thesisId}
        RETURNING *;
      `;
      var createQuery2 = `
        INSERT INTO members_done(thesis_id, committee_id)
        VALUES (
          '${thesisId}',
          '${userId}'
        )
        RETURNING *;
      `;
      db.query(createQuery, (req, data) => {
        console.log('req', req);
        console.log('created', data);
        resolve(data.rows[0]);
      });
      db.query(createQuery2, (req2, data2) => {
        console.log('req2', req2);
        console.log('created2', data2);
        resolve(data2.rows[0]);
      });
    });
    return promise;
  },

  committeeReject: (thesisId, userId) => {
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        INSERT INTO members_done(thesis_id, committee_id)
        VALUES (
          '${thesisId}',
          '${userId}'
        )
        RETURNING *;
      `;
      db.query(createQuery, (req, data) => {
        console.log('req', req);
        console.log('created', data);
        resolve(data.rows[0]);
      });
    });
    return promise;
  },

  listMor: () => {
    const query = `
      SELECT 
        t.id,
        t.title,
        t.abstract,
        t.group_id
      FROM thesis t
      WHERE t.current_stage = 'mor'
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

module.exports = Thesis;