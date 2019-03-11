const db = require('./../db');

var Defense = {

  createMor: (thesisId) => {
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        INSERT INTO defense(defense_type, thesis_id)
        VALUES (
          'mor',
          '${thesisId}'
        )
        RETURNING *
      `;
      var createQuery2 = `
        UPDATE thesis
        SET current_stage = 'mor'
        WHERE id = ${thesisId}
        RETURNING *
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

  getThesisIdByDefenseId: (defense_type, defenseId) => {
    const query = `
      SELECT
        t.id
      FROM defense d
      INNER JOIN thesis t ON d.thesis_id = t.id
      WHERE d.defense_type = '${defense_type}'
      AND d.id = ${defenseId}
    `;
    var promise = new Promise((resolve, reject) => {
      db.query(query, (req, data) => {
        console.log('req', req)
        console.log('data', data)
        if (data && data.rowCount) {
          resolve(data.rows[0].id);
        } else {
          resolve([]);
        }
      });
    });
    return promise;
  },

  createDp1Dp2Defense: (thesisId, defense_type) => {
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        INSERT INTO defense(defense_type, thesis_id)
        VALUES (
          '${defense_type}',
          '${thesisId}'
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

  listMorDp1Dp2: (defense_type) => {
    const query = `
      SELECT
        d.id,
        d.defense_type,
        d.thesis_id,
        d.status_id,
        d.panel_id,
        d.schedule,
        t.title,
        t.abstract,
        t.group_id,
        t.year,
        t.adviser_id
      FROM defense d
      INNER JOIN thesis t ON d.thesis_id = t.id
      WHERE d.defense_type = '${defense_type}'
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

  listMorDp1Dp2ByDefenseId: (defense_type, defenseId) => {
    const query = `
      SELECT
        d.id,
        d.defense_type,
        d.thesis_id,
        d.status_id,
        d.panel_id,
        d.schedule,
        t.title,
        t.abstract,
        t.group_id,
        t.year,
        t.adviser_id
      FROM defense d
      INNER JOIN thesis t ON d.thesis_id = t.id
      WHERE d.defense_type = '${defense_type}'
      AND d.id = '${defenseId}'
    `;
    var promise = new Promise((resolve, reject) => {
      db.query(query, (req, data) => {
        console.log('req', req)
        console.log('data', data)
        if (data && data.rowCount) {
          resolve(data.rows[0]);
        } else {
          resolve([]);
        }
      });
    });
    return promise;
  },

  listMorDp1Dp2ByHeadPanel: (defense_type, facultyId) => {
    const query = `
      SELECT
        d.id,
        d.defense_type,
        d.thesis_id,
        d.status_id,
        d.panel_id,
        d.schedule,
        t.title,
        t.abstract,
        t.group_id,
        t.year,
        t.adviser_id,
        pm.head_panel_id,
        pm.faculty_id
      FROM defense d
      INNER JOIN thesis t ON d.thesis_id = t.id
      INNER JOIN panel p ON d.panel_id = p.id
      INNER JOIN panel_members pm ON p.id = pm.panel_id
      WHERE d.defense_type = '${defense_type}'
      AND pm.head_panel_id = ${facultyId}
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

  listMorDp1Dp2ByFacultyId: (defense_type, facultyId) => {
    const query = `
      SELECT
        d.id,
        d.defense_type,
        d.thesis_id,
        d.status_id,
        d.panel_id,
        d.schedule,
        t.title,
        t.abstract,
        t.group_id,
        t.year,
        t.adviser_id,
        pm.head_panel_id,
        PM.faculty_id
      FROM defense d
      INNER JOIN thesis t ON d.thesis_id = t.id
      INNER JOIN panel p ON d.panel_id = p.id
      INNER JOIN panel_members pm ON p.id = pm.panel_id
      WHERE d.defense_type = '${defense_type}'
      AND pm.faculty_id = ${facultyId}
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

  listMorDp1Dp2ByGroupId: (groupId, defense_type) => {
    const query = ` 
      SELECT 
        d.thesis_id,
        d.id,
        t.title,
        t.abstract,
        t.group_id,
        t.year,
        d.schedule,
        dg.grades,
        u.first_name,
        u.last_name,
        c.comment
      FROM thesis t
      INNER JOIN defense d ON t.id = d.thesis_id
      INNER JOIN defense_grades dg ON d.id = dg.defense_id 
      INNER JOIN comments c ON d.id = c.defense_id
      INNER JOIN users u ON c.faculty_id = u.id
      WHERE t.group_id = ${groupId}
      AND d.defense_type = '${defense_type}'
      ORDER BY t.id
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

  listCommentByDefenseId: (defenseId) => {
    const query = ` 
      SELECT 
        *
      FROM comments c
      INNER JOIN users u ON c.faculty_id = u.id
      WHERE c.defense_id = ${defenseId}
      ORDER BY c.id
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

  createPanel: (defenseId) => {
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        INSERT INTO panel(defense_id)
        VALUES ('${defenseId}')
        RETURNING *;
      `;
      var createQuery2 = `
        INSERT INTO defense_grades(defense_id)
        VALUES ('${defenseId}')
      `;
      db.query(createQuery, (req, data) => {
        // console.log('req', req);
        console.log('created', data.rows[0]);
        resolve(data.rows[0].id);
      });
      db.query(createQuery2, (req2, data2) => {
        // console.log('req2', req2);
        console.log('created2', data2);
        resolve(data2.rows);
      });

    });
    return promise;
  },

  updateSchedAndPanel: (panelId, defenseId, schedule, headPanelId, facultyId) => {
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        INSERT INTO comments(defense_id, faculty_id)
        VALUES (
          '${defenseId}',
          '${headPanelId}'
        )
        RETURNING *;
      `;
      var createQuery2 = `
        INSERT INTO comments(defense_id, faculty_id)
        VALUES (
          '${defenseId}',
          '${facultyId}'
        )
      `;
      var createQuery3 = `
        INSERT INTO panel_members(panel_id, faculty_id, head_panel_id)
        VALUES (
          '${panelId}',
          '${facultyId}',
          '${headPanelId}'
        )
        RETURNING *;
      `;
       var createQuery4 = `
        UPDATE defense
        SET schedule = '${schedule}',
        panel_id = ${panelId},
        status_id = dg.id
        FROM defense_grades dg
        WHERE defense.id = ${defenseId}
        AND dg.defense_id = ${defenseId}
        RETURNING *;
      `;
      db.query(createQuery, (req, data) => {
        // console.log('req2', req2);
        console.log('created', data);
        resolve(data.rows);
      });
      db.query(createQuery2, (req2, data2) => {
        // console.log('req2', req2);
        console.log('created2', data2);
        resolve(data2.rows);
      });
      db.query(createQuery3, (req3, data3) => {
        // console.log('req3', req3);
        console.log('created3', data3);
        resolve(data3.rows);
      });
      db.query(createQuery4, (req4, data4) => {
        // console.log('req3', req3);
        console.log('created4', data4);
        resolve(data4.rows[0]);
      });

    });
    return promise;
  },

  listPanelMembers: (defenseId) => {
     const query = ` 
      SELECT * FROM users u
      WHERE u.id IN (
        (SELECT 
          pm.head_panel_id AS id1 
         FROM panel_members pm 
         INNER JOIN panel p ON pm.panel_id = p.id
         WHERE p.defense_id = '${defenseId}'), 
        (SELECT pm.faculty_id AS id2 
         FROM panel_members pm
         INNER JOIN panel p ON pm.panel_id = p.id 
         WHERE p.defense_id = '${defenseId}')
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

  addComments: (defenseId, facultyId, comment) => {
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        UPDATE comments
        SET comment = '${comment}'
        WHERE defense_id = ${defenseId}
        AND faculty_id = ${facultyId}
        RETURNING *;
      `;
      db.query(createQuery, (req, data) => {
        console.log('created', data);
        resolve(data.rows[0]);
      });
    });
    return promise;
  },

  addGrades: (grades, defenseId) => {
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        UPDATE defense_grades
        SET grades = '${grades}'
        WHERE defense_id = ${defenseId}
        RETURNING *;
      `;
      db.query(createQuery, (req, data) => {
        console.log('created', data);
        resolve(data.rows[0]);
      });
    });
    return promise;
  },

  nextStage: (defense_type, defenseId) => {
    const promise = new Promise((resolve, reject) => {
      // var createQuery2 = `
      //   UPDATE defense
      //   SET defense_type = '${defense_type}'
      //   WHERE id = ${defenseId}
      //   RETURNING *;
      // `;
      var createQuery3 = `
        UPDATE thesis t
        SET current_stage = '${defense_type}'
        WHERE t.id = (SELECT t.id FROM defense d INNER JOIN thesis t ON d.thesis_id = t.id WHERE d.id = ${defenseId})
        RETURNING *;
      `;
      // db.query(createQuery2, (req2, data2) => {
      //   console.log('created', data2);
      //   resolve(data2.rows[0]);
      // });
      db.query(createQuery3, (req3, data3) => {
        console.log('created', data3);
        resolve(data3.rows[0]);
      });
    });
    return promise;
  },

  finishThesis: (thesisId) => {
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        UPDATE thesis
        SET final_verdict = true
        WHERE id = ${thesisId}
        RETURNING *;
      `;
      db.query(createQuery, (req, data) => {
        console.log('created', data);
        resolve(data.rows[0]);
      });
    });
    return promise;
  },

  listFinishedThesis: () => {
    const promise = new Promise((resolve, reject) => {
      var createQuery = `
        SELECT * FROM thesis
        WHERE final_verdict = true
        ORDER BY id
      `;
      db.query(createQuery, (req, data) => {
        console.log('created', data);
        resolve(data.rows);
      });
    });
    return promise;
  }

};

module.exports = Defense;