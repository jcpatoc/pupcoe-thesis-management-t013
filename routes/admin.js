var express = require('express');
var router = express.Router();
const User = require('./../models/user');
const Class = require('./../models/class');
const Group = require('./../models/group');
const Committee = require('./../models/committee');
const Thesis = require('./../models/thesis');
const Defense = require('./../models/defense');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    res.render('admin/home', { layout: 'admin' });
  } else {
    res.redirect('/')
  }
});

router.get('/faculties', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    User.list('faculty')
        .then(function(users) {
          console.log('users', users)
          res.render('admin/faculties', { layout: 'admin', users: users });
        })
  } else {
    res.redirect('/')
  }
}); 

router.get('/faculty-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    res.render('admin/faculty_create', { layout: 'admin' });
  } else {
    res.redirect('/')
  }
});

router.post('/faculty-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('create', req.body);
    User.create(req.body)
        .then(function(user) {
          res.redirect('/admin/faculties');
        });
  } else {
    res.redirect('/')
  }
})

router.get('/students', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    User.list('student')
        .then(function(users) {
          res.render('admin/students', { layout: 'admin', users: users });
        })
  } else {
    res.redirect('/')
  }
});

router.get('/student-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    res.render('admin/student_create', { layout: 'admin' });
  } else {
    res.redirect('/')
  }
});
router.post('/student-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('create', req.body);
    User.create(req.body)
        .then(function(user) {
          res.redirect('/admin/students');
        });
  } else {
    res.redirect('/')
  }
})


router.get('/classes', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    Class.list()
      .then((classes) => {
        console.log('classes', classes)
        res.render('admin/classes', { layout: 'admin', classes: classes });
      })
  } else {
    res.redirect('/')
  }
});
router.get('/class/:classId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    Class.getById(req.params.classId)
      .then((classData) => {
        console.log('class', classData)
        User.noClassList('student')
          .then((allStudents) => {
            Class.getStudentsByClassId(req.params.classId).then((classStudents)=> {
              res.render('admin/class_detail', { layout: 'admin', classData: classData, allStudents: allStudents, classStudents: classStudents });
            })
          })
      })
  } else {
    res.redirect('/')
  }
});

router.get('/class-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    User.list('faculty')
      .then((users) => {
        res.render('admin/class_create', { layout: 'admin', faculties: users });
      })
  } else {
    res.redirect('/')
  }
});

router.post('/class-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('create class', req.body);
    Class.create(req.body).then((createdClass) => {
      res.redirect('/admin/classes')
    });
  } else {
    res.redirect('/')
  }
}),

router.get('/committee', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    User.listCommittee('committee')
      .then((committee_members) => {
        User.notCommitteeList('faculty')
         .then((allFaculty) => {
        console.log('commmiteeData', committee_members)
            res.render('admin/committee', {
              layout: 'admin',
              allFaculty: allFaculty,
              committee_members:committee_members
            });
          })
      })
  } else {
    res.redirect('/')
  }
}); 

router.post('/committee/remove-member/:facultyId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('params', req.params);
    console.log('facultyId', req.params.facultyId);
    Committee.deleteMember(req.params.facultyId).then(() => {
      res.redirect('/admin/committee');
    });
  } else {
    res.redirect('/')
  }
});

// Thesis proposals routes

router.get('/thesis', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
        // create function for viewing all thesis
    var is_Committee = false;
    Committee.checkIfCommittee(req.user.id)
      .then(function(isCommittee) {
        console.log('isCOM',isCommittee)
        if (isCommittee) {
          is_Committee = true;
        }
        console.log('iscom', is_Committee)
      Thesis.list()
        .then(function(thesis) {
          console.log('thesis data', thesis);
          res.render('admin/thesis', {
            layout: 'admin',
            thesis: thesis,
            is_Committee: is_Committee
          });
        });

      });

  } else {
    res.redirect('/')
  }
});

router.get('/thesis/adviser-approval', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
        // create function for viewing all thesis
    Thesis.listByAdviserId(req.user.id)
      .then(function(adviser_approval) {
        console.log('thesis data', adviser_approval);
        res.render('admin/adviser_approval', {
          layout: 'admin',
          adviser_approval: adviser_approval
        });
      });
  } else {
    res.redirect('/')
  }
});
// POST rote for approve and reject

router.post('/thesis/adviser-approval/approve', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
        // create function for viewing all thesis
    console.log('id', req.body)
    Thesis.adviserApproved(req.body.thesisId)
      .then(function(adviser_approval) {
        console.log('adviser approved:', adviser_approval);
        res.redirect('/admin/thesis/adviser-approval')
      });
  } else {
    res.redirect('/')
  }
});

router.post('/thesis/adviser-approval/reject', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
        // create function for viewing all thesis
    console.log('id', req.body)
    Thesis.adviserRejected(req.body.thesisId)
      .then(function(adviser_approval) {
        console.log('adviser approved:', adviser_approval);
        res.redirect('/admin/thesis/adviser-approval')
      });
  } else {
    res.redirect('/')
  }
});

router.get('/thesis/committee-approval', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    // create function for showing only theses that has not been judged yet by the specific faculty
    Thesis.listForCommitteeApproval(req.user.id)
      .then(function(committee_approval) {
        console.log('thesis data', committee_approval);
        res.render('admin/committee_approval', {
          layout: 'admin',
          committee_approval: committee_approval
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/thesis/committee-approval/approve', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    // create function for viewing all thesis
    console.log('id', req.body)
    Thesis.committeeApproved(req.body.thesisId, req.user.id)
      .then(function(committee_approval) {
    // Create function to check if approval count reached more than 70%
        Thesis.checkCommitteeApprovalCount(req.body.thesisId)
          .then(function(memberCount) {
            console.log('memberCount', memberCount);
            var memCount = memberCount[0].member_approval;
            if (memCount > 4) {                          // 5 members approval needed for committee approval
              Thesis.committeeApprovedComplete(req.body.thesisId)
            }
            console.log('committee approved:', committee_approval);
            res.redirect('/admin/thesis/committee-approval')
          })
      });
  } else {
    res.redirect('/')
  }
});

router.post('/thesis/committee-approval/reject', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
        // create function for viewing all thesis
    console.log('id', req.body)
    Thesis.committeeReject(req.body.thesisId, req.user.id)
      .then(function(committee_approval) {
        console.log('committee approved:', committee_approval);
        // Insert function that will check if committee count for approval is reached
        res.redirect('/admin/thesis/committee-approval')
      });
  } else {
    res.redirect('/')
  }
});

// Thesis proposal routes end

// COPY FROM THIS PART for FACULTY VIEWS
// MOR routes

router.get('/mor', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    Defense.listMorDp1Dp2('mor') //change this maybe
      .then(function (data) {
        Defense.listMorDp1Dp2ByHeadPanel('mor', req.user.id)
        .then(function (HeadPanel) {
          Defense.listMorDp1Dp2ByFacultyId('mor', req.user.id)
          .then(function (PanelMember) {
            data.forEach(function(t) {
              t.defense_type = 'mor';
            });
            HeadPanel.forEach(function(t) {
              t.defense_type = 'mor';
            });
            PanelMember.forEach(function(t) {
              t.defense_type = 'mor';
            })
            res.render('admin/defense', {
              layout: 'admin',
              data: data,
              HeadPanel: HeadPanel,
              PanelMember: PanelMember,
              type: 'Methods of Research'
            });
          });
        });
      });
  } else {
    res.redirect('/')
  }
});

router.get('/mor/set-sched-and-panel/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('mor', req.params.defenseId)
      .then(function (data) {
        console.log('listbyDefenseId', data)
        User.list('faculty')
        .then (function (faculties) {
          res.render('admin/sched-panel', {
            layout: 'admin',
            data: data,
            faculties: faculties,
            defense_type: 'mor'
          });
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/mor/set-sched-and-panel/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('sched and panel data', req.body.schedule, req.body.head_panel_id, req.body.faculty_id);
    // add function to update sched and create panel data
    Defense.createPanel(req.params.defenseId) // Can be improved by creating the panel at student choosing thesis for defense
      .then (function (panelId) {
        console.log('panelId', panelId)
        Defense.updateSchedAndPanel(panelId, req.params.defenseId, req.body.schedule, req.body.head_panel_id, req.body.faculty_id)
          .then (function (status) {
            console.log('status', status);
            res.redirect('/admin/mor');
          })
      });
  } else {
    res.redirect('/admin/mor')
  }
});

router.get('/mor/details/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('mor', req.params.defenseId)
      .then(function (data) {
        console.log('listbyDefenseId', data)
        Defense.listPanelMembers(req.params.defenseId)
          .then (function (panel_members) {
            console.log('panelmem', panel_members)
            res.render('admin/defense_details', {
              layout: 'admin',
              data: data,
              panel_members: panel_members
            });
          });
      });
  } else {  
    res.redirect('/')
  }
});

router.get('/mor/grade/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('mor', req.params.defenseId)
      .then(function (data) {
        res.render('admin/head_panel-grade', {
          layout: 'admin',
          data: data,
          defense_type: 'mor'
        });
      });
  } else {
    res.redirect('/')
  }
});

router.get('/mor/comments/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('mor', req.params.defenseId)
      .then(function (data) {
        console.log('listbyDefenseId', data)
        res.render('admin/panel-comment', {
          layout: 'admin',
          data: data,
          defense_type: 'mor'
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/mor/grade/:defenseId/add-grades', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('defenseId', req.params.defenseId);
    console.log('sched and panel data', req.body);
    // add function for changing grade and promoting to dp1
    Defense.addGrades(req.body.grades, req.params.defenseId)
      .then(function(grades) {
        Defense.addComments(req.params.defenseId, req.user.id, req.body.comment)
        .then(function (comments) {
          if (req.body.grades != 'Failed') {
            Defense.getThesisIdByDefenseId('mor', req.params.defenseId)
              .then(function (thesisId) {
                console.log('id', thesisId)
                Defense.createDp1Dp2Defense(thesisId, 'dp1')
                  .then(function (created) {
                    Defense.nextStage('dp1', req.params.defenseId)
                      .then(function (nextstage) {
                        res.redirect('/admin/mor');
                      })
                  });
              })
          } else {
            console.log('sched  and panel data', req.body);
            res.redirect('/admin/mor');
          }
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/mor/comments/:defenseId/add-comments', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('defenseId', req.params.defenseId);
    console.log('sched and panel data', req.body);
    // add function for changing grade and promoting to dp1
    Defense.addComments(req.params.defenseId, req.user.id, req.body.comment)
      .then(function (comments) {
        console.log('sched and panel data', req.body);
        res.redirect('/admin/mor');
      });
  } else {
    res.redirect('/')
  }
});
// mor routes done

//dp1 routes start here
router.get('/dp1', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    Defense.listMorDp1Dp2('dp1') //change this maybe
      .then(function (data) {
        Defense.listMorDp1Dp2ByHeadPanel('dp1', req.user.id)
        .then(function (HeadPanel) {
          Defense.listMorDp1Dp2ByFacultyId('dp1', req.user.id)
          .then(function (PanelMember) {
            data.forEach(function(t) {
              t.defense_type = 'dp1';
            });
            HeadPanel.forEach(function(t) {
              t.defense_type = 'dp1';
            });
            PanelMember.forEach(function(t) {
              t.defense_type = 'dp1';
            })
            res.render('admin/defense', {
              layout: 'admin',
              data: data,
              HeadPanel: HeadPanel,
              PanelMember: PanelMember,
              type: 'Design Project 1'
            });
          });
        });
      });
  } else {
    res.redirect('/')
  }
});

router.get('/dp1/set-sched-and-panel/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('dp1', req.params.defenseId)
      .then(function (data) {
        console.log('listbyDefenseId', data)
        User.list('faculty')
        .then (function (faculties) {
          res.render('admin/sched-panel', {
            layout: 'admin',
            data: data,
            faculties: faculties,
            defense_type: 'dp1'
          });
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/dp1/set-sched-and-panel/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('sched and panel data', req.body.schedule, req.body.head_panel_id, req.body.faculty_id);
    // add function to update sched and create panel data
    Defense.createPanel(req.params.defenseId) // Can be improved by creating the panel at student choosing thesis for defense
      .then (function (panelId) {
        console.log('panelId', panelId)
        Defense.updateSchedAndPanel(panelId, req.params.defenseId, req.body.schedule, req.body.head_panel_id, req.body.faculty_id)
          .then (function (status) {
            console.log('status', status);
            res.redirect('/admin/dp1');
          })
      });
  } else {
    res.redirect('/admin/dp1')
  }
});

router.get('/dp1/details/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('dp1', req.params.defenseId)
      .then(function (data) {
        console.log('listbyDefenseId', data)
        Defense.listPanelMembers(req.params.defenseId)
          .then (function (panel_members) {
            console.log('panelmem', panel_members)
            res.render('admin/defense_details', {
              layout: 'admin',
              data: data,
              panel_members: panel_members
            });
          });
      });
  } else {  
    res.redirect('/')
  }
});

router.get('/dp1/grade/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('dp1', req.params.defenseId)
      .then(function (data) {
        res.render('admin/head_panel-grade', {
          layout: 'admin',
          data: data,
          defense_type: 'dp1'
        });
      });
  } else {
    res.redirect('/')
  }
});

router.get('/dp1/comments/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('dp1', req.params.defenseId)
      .then(function (data) {
        console.log('listbyDefenseId', data)
        res.render('admin/panel-comment', {
          layout: 'admin',
          data: data,
          defense_type: 'dp1'
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/dp1/grade/:defenseId/add-grades', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('defenseId', req.params.defenseId);
    console.log('sched and panel data', req.body);
    // add function for changing grade and promoting to dp1
    Defense.addGrades(req.body.grades, req.params.defenseId)
      .then(function(grades) {
        Defense.addComments(req.params.defenseId, req.user.id, req.body.comment)
        .then(function (comments) {
          if (req.body.grades != 'Failed') {
            Defense.getThesisIdByDefenseId('dp1', req.params.defenseId)
              .then(function (thesisId) {
                console.log('id', thesisId)
                Defense.createDp1Dp2Defense(thesisId, 'dp2') //change 1 step higher
                  .then(function (created) {
                    Defense.nextStage('dp2', req.params.defenseId)
                      .then(function (nextstage) {
                        res.redirect('/admin/dp1');
                      })
                  });
              })
          } else {
            console.log('sched  and panel data', req.body);
            res.redirect('/admin/dp1');
          }
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/dp1/comments/:defenseId/add-comments', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('defenseId', req.params.defenseId);
    console.log('sched and panel data', req.body);
    // add function for changing grade and promoting to dp1
    Defense.addComments(req.params.defenseId, req.user.id, req.body.comment)
      .then(function (comments) {
        console.log('sched and panel data', req.body);
        res.redirect('/admin/dp1');
      });
  } else {
    res.redirect('/')
  }
});

//dp1 ends here


//dp2 routes start here
router.get('/dp2', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    Defense.listMorDp1Dp2('dp2') //change this maybe
      .then(function (data) {
        Defense.listMorDp1Dp2ByHeadPanel('dp2', req.user.id)
        .then(function (HeadPanel) {
          Defense.listMorDp1Dp2ByFacultyId('dp2', req.user.id)
          .then(function (PanelMember) {
            data.forEach(function(t) {
              t.defense_type = 'dp2';
            });
            HeadPanel.forEach(function(t) {
              t.defense_type = 'dp2';
            });
            PanelMember.forEach(function(t) {
              t.defense_type = 'dp2';
            })
            res.render('admin/defense', {
              layout: 'admin',
              data: data,
              HeadPanel: HeadPanel,
              PanelMember: PanelMember,
              type: 'Design Project 2'
            });
          });
        });
      });
  } else {
    res.redirect('/')
  }
});

router.get('/dp2/set-sched-and-panel/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('dp2', req.params.defenseId)
      .then(function (data) {
        console.log('listbyDefenseId', data)
        User.list('faculty')
        .then (function (faculties) {
          res.render('admin/sched-panel', {
            layout: 'admin',
            data: data,
            faculties: faculties,
            defense_type: 'dp2'
          });
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/dp2/set-sched-and-panel/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('sched and panel data', req.body.schedule, req.body.head_panel_id, req.body.faculty_id);
    // add function to update sched and create panel data
    Defense.createPanel(req.params.defenseId) // Can be improved by creating the panel at student choosing thesis for defense
      .then (function (panelId) {
        console.log('panelId', panelId)
        Defense.updateSchedAndPanel(panelId, req.params.defenseId, req.body.schedule, req.body.head_panel_id, req.body.faculty_id)
          .then (function (status) {
            console.log('status', status);
            res.redirect('/admin/dp2');
          })
      });
  } else {
    res.redirect('/admin/dp2')
  }
});

router.get('/dp2/details/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('dp2', req.params.defenseId)
      .then(function (data) {
        console.log('listbyDefenseId', data)
        Defense.listPanelMembers(req.params.defenseId)
          .then (function (panel_members) {
            console.log('panelmem', panel_members)
            res.render('admin/defense_details', {
              layout: 'admin',
              data: data,
              panel_members: panel_members
            });
          });
      });
  } else {  
    res.redirect('/')
  }
});

router.get('/dp2/grade/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('dp2', req.params.defenseId)
      .then(function (data) {
        res.render('admin/head_panel-grade', {
          layout: 'admin',
          data: data,
          defense_type: 'dp2'
        });
      });
  } else {
    res.redirect('/')
  }
});

router.get('/dp2/comments/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('dp2', req.params.defenseId)
      .then(function (data) {
        console.log('listbyDefenseId', data)
        res.render('admin/panel-comment', {
          layout: 'admin',
          data: data,
          defense_type: 'dp2'
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/dp2/grade/:defenseId/add-grades', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('defenseId', req.params.defenseId);
    console.log('sched and panel data', req.body);
    // add function for changing grade and promoting to dp1
    Defense.addGrades(req.body.grades, req.params.defenseId)
      .then(function(grades) {
        Defense.addComments(req.params.defenseId, req.user.id, req.body.comment)
        .then(function (comments) {
          if (req.body.grades != 'Failed') {
            Defense.getThesisIdByDefenseId('dp2', req.params.defenseId)
              .then(function (thesisId) {
                Defense.finishThesis (thesisId)
                  .then(function (yes) {
                  res.redirect('/admin/dp2');
                  });
              })
          } else {
            console.log('sched  and panel data', req.body);
            res.redirect('/admin/dp2');
          }
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/dp2/comments/:defenseId/add-comments', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    console.log('defenseId', req.params.defenseId);
    console.log('sched and panel data', req.body);
    // add function for changing grade and promoting to dp1
    Defense.addComments(req.params.defenseId, req.user.id, req.body.comment)
      .then(function (comments) {
        console.log('sched and panel data', req.body);
        res.redirect('/admin/dp2');
      });
  } else {
    res.redirect('/')
  }
});

router.get('/finished', function(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    Defense.listFinishedThesis('done')
      .then(function(list) {
        console.log('list', list);
        res.render('admin/finished', {
          layout: 'admin',
          list: list
        });
      })
  } else {
    res.redirect('/')
  }
});

//dp2 ends here

module.exports = router;
