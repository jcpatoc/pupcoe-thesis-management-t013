const db = require('../db/index.js')
const bcrypt = require('bcryptjs')
const user = require('./users.js')
const _ = require('lodash')
var actions = {
  getSectionData: (id, callback) => {
    const query = {
      text: `SELECT * FROM classes WHERE student_id = ${id}`
    }
    db.query(query).then(sectionId => {
      const query2 = {
        text: `SELECT class.id, batch_id, section_id, fname, lname FROM classes INNER JOIN users ON users.id = class.advisor_id WHERE class.id = ${sectionId.rows[0].class_id}`
      }
      db.query(query2).then(data => {
        callback(data.rows[0])
      }).catch(e => {
        console.log(e)
        callback(e)
      })
    }).catch(e => {
      console.log(e)
      callback(e)
    })
  },
  getMyGroupData: (userId, callback) => {
    const query = {
      text: `SELECT group_id, members_id FROM groups 
        INNER JOIN groups ON groups.id = groups.group_id
        WHERE members_id = ${userId}`
    }
    db.query(query).then(data => {
      return callback(data.rows[0])
    }).catch(e => {
      console.log(e)
      return callback(e)
    })
  },
  getGroupMembers: (groupId, callback) => {
    const query = {
      text: `SELECT fname, lname FROM groups 
        INNER JOIN users ON users.id = groups.members_id
        WHERE group_id = ${groupId}
        ORDER BY last_name ASC, first_name ASC`
    }
    db.query(query).then(data => {
      return callback(data.rows)
    }).catch(e => {
      console.log(e)
      return callback(e)
    })
  },

  getThesisProposals: (groupId, callback) => {
    const query = {
      text: `SELECT * FROM thesis WHERE group_id = ${groupId} ORDER BY date_created ASC, date_updated ASC`
    }

    db.query(query).then(data => {
      return callback(data.rows)
    }).catch(e => {
      console.log(e)
      return callback(e)
    })

  },

  submitThesisProposal: (data, callback) => {
    const query = {
      text: `INSERT INTO thesis (stage_id, group_id, current_defense_id) VALUES ($1, $2, $3, 'For Approval')`,
      values: [data.stage_id, data.groupId,  data.currentDefenseID]
    }

    db.query(query).then(data => {
      return callback(data)
    }).catch(e => {
      console.log(e)
      return callback(e)
    })
  }, 

  makeMainThesis: (thesisId, callback) => {
    const query = {
      text: `UPDATE thesis SET is_main = true WHERE id = $1`, 
      values: [thesisId]
    }
    db.query(query).then(data => {
      return callback(data)
    }).catch(e => {
      console.log(e)
      return callback(e)
    })
  },

  getApprovedThesis: (groupId, callback) => {
    const query = {
      text: `SELECT * FROM thesis WHERE group_id = $1 and is_approved = true`, 
      values: [groupId]
    }
    db.query(query).then(data => {
      return callback(data.rows)
    }).catch(e => {
      console.log(e)
      return callback(e)
    })
  },

  checkIfNoMainTopic: (groupId, callback) => {
    const query = {
      text: `SELECT EXISTS (SELECT id FROM thesis WHERE group_id = $1 AND is_main = true)`,
      values: [groupId]
    }
    db.query(query).then(data => {
      console.log(data.rows[0].exists)
      return callback(data.rows[0].exists)
    }).catch(e => {
      console.log(e)
      return callback(e)
    })
  }, 

  getMainThesis: (groupId, callback) => {
    const query = {
      text: `SELECT * FROM thesis WHERE group_id = $1 AND is_main = true`,
      values: [groupId]
    }
    db.query(query).then(data => {
      return callback(data.rows[0])
    }).catch(e => {
      console.log(e)
      return callback(e)
    })
  },

  getSchedule: (thesisId, callback) => {
    const query = {
      text: `SELECT * FROM schedules WHERE thesis_id = $1`,
      values: [thesisId]
    }
    db.query(query).then(data => {
      return callback(data.rows[0])
    }).catch(e => {
      console.log(e)
      return callback(e)
    })
  }


}

module.exports = actions