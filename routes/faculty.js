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
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    res.render('faculty/home', { layout: 'faculty' });
  } else {
    res.redirect('/')
  }
});

router.get('/classes', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    Class.listByFacultyId(req.user.id)
      .then((classes) => {
        console.log('classes', classes)
        res.render('faculty/classes', { layout: 'faculty', classes: classes });
      })
  } else {
    res.redirect('/')
  }
});

router.get('/class/:classId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    Class.getById(req.params.classId)
      .then((classData) => {
        console.log('class', classData)
        Class.getStudentsByClassId(req.params.classId).then((classStudents)=> {
          res.render('faculty/class_detail', { 
		  layout: 'faculty',
		  classData: classData,
		  classStudents: classStudents 
		  });
        })
      })
  } else {
    res.redirect('/')
  }
});

router.get('/groups', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    Group.listByFacultyId(req.user.id)
      .then((groups) => {
        console.log('groups', groups)
        res.render('faculty/groups', { layout: 'faculty', groups: groups });
      })
  } else {
    res.redirect('/')
  }
}); // done

router.get('/group/:groupId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    Group.getById(req.params.groupId)
      .then((groupData) => {
        User.noGroupList('student')
          .then((allStudents) => {
            Group.getStudentsByGroupId(req.params.groupId)
              .then((group_members) => {
                res.render('faculty/group_detail', { layout: 'faculty', allStudents: allStudents, groupData: groupData, group_members: group_members });
              })
          })
      })
  } else {
    res.redirect('/')
  }
});

router.get('/group-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    res.render('faculty/group-create', {layout: 'faculty',  adviserId: req.user.id});
  } else {
    res.redirect('/')
  }
});

router.post('/group-create', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('create group', req.body);
    Group.create(req.body).then((createdGroup) => {
      res.redirect('/faculty/groups')
    });
  } else {
    res.redirect('/')
  }
});

router.post('/group/:groupId/remove-student/:studentId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('params', req.params);
    console.log('studentId', req.params.studentId);
    console.log('groupId', req.params.groupId);
    Group.deleteMember(req.params.studentId).then(() => {
      res.redirect('/faculty/group/'+req.params.groupId+'')
    });
  } else {
    res.redirect('/')
  }
});

router.get('/thesis', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
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
          res.render('faculty/thesis', {
            layout: 'faculty',
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
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
        // create function for viewing all thesis
    Thesis.listByAdviserId(req.user.id)
      .then(function(adviser_approval) {
        console.log('thesis data', adviser_approval);
        res.render('faculty/adviser_approval', {
          layout: 'faculty',
          adviser_approval: adviser_approval
        });
      });
  } else {
    res.redirect('/')
  }
});
// POST rote for approve and reject

router.post('/thesis/adviser-approval/approve', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
        // create function for viewing all thesis
    console.log('id', req.body)
    Thesis.adviserApproved(req.body.thesisId)
      .then(function(adviser_approval) {
        console.log('adviser approved:', adviser_approval);
        res.redirect('/faculty/thesis/adviser-approval')
      });
  } else {
    res.redirect('/')
  }
});

router.post('/thesis/adviser-approval/reject', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
        // create function for viewing all thesis
    console.log('id', req.body)
    Thesis.adviserRejected(req.body.thesisId)
      .then(function(adviser_approval) {
        console.log('adviser approved:', adviser_approval);
        res.redirect('/faculty/thesis/adviser-approval')
      });
  } else {
    res.redirect('/')
  }
});

router.get('/thesis/committee-approval', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    // create function for showing only theses that has not been judged yet by the specific faculty
    Thesis.listForCommitteeApproval(req.user.id)
      .then(function(committee_approval) {
        console.log('thesis data', committee_approval);
        res.render('faculty/committee_approval', {
          layout: 'faculty',
          committee_approval: committee_approval
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/thesis/committee-approval/approve', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    // create function for viewing all thesis
    console.log('id', req.body)
    Thesis.committeeApproved(req.body.thesisId, req.user.id)
      .then(function(committee_approval) {
        Thesis.checkCommitteeApprovalCount(req.body.thesisId)
          .then(function(memberCount) {
            console.log('memberCount', memberCount);
            var memCount = memberCount[0].member_approval;
            if (memCount > 4) {   // 5 members approval needed for committee approval
              Thesis.committeeApprovedComplete(req.body.thesisId)
            }
            console.log('committee approved:', committee_approval);
            res.redirect('/faculty/thesis/committee-approval')
          })
      });
  } else {
    res.redirect('/')
  }
});

router.post('/thesis/committee-approval/reject', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
        // create function for viewing all thesis
    console.log('id', req.body)
    Thesis.committeeReject(req.body.thesisId, req.user.id)
      .then(function(committee_approval) {
        console.log('committee approved:', committee_approval);
        res.redirect('/faculty/thesis/committee-approval')
      });
  } else {
    res.redirect('/')
  }
});

// MOR routes

router.get('/mor', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
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
            res.render('faculty/defense', {
              layout: 'faculty',
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
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('mor', req.params.defenseId)
      .then(function (data) {
        console.log('listbyDefenseId', data)
        User.list('faculty')
        .then (function (faculties) {
          res.render('faculty/sched-panel', {
            layout: 'faculty',
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
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('sched and panel data', req.body.schedule, req.body.head_panel_id, req.body.faculty_id);
    // add function to update sched and create panel data
    Defense.createPanel(req.params.defenseId) // Can be improved by creating the panel at student choosing thesis for defense
      .then (function (panelId) {
        console.log('panelId', panelId)
        Defense.updateSchedAndPanel(panelId, req.params.defenseId, req.body.schedule, req.body.head_panel_id, req.body.faculty_id)
          .then (function (status) {
            console.log('status', status);
            res.redirect('/faculty/mor');
          })
      });
  } else {
    res.redirect('/faculty/mor')
  }
});

router.get('/mor/details/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('mor', req.params.defenseId)
      .then(function (data) {
        console.log('listbyDefenseId', data)
        Defense.listPanelMembers(req.params.defenseId)
          .then (function (panel_members) {
            console.log('panelmem', panel_members)
            res.render('faculty/defense_details', {
              layout: 'faculty',
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
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('mor', req.params.defenseId)
      .then(function (data) {
        res.render('faculty/head_panel-grade', {
          layout: 'faculty',
          data: data,
          defense_type: 'mor'
        });
      });
  } else {
    res.redirect('/')
  }
});

router.get('/mor/comments/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('mor', req.params.defenseId)
      .then(function (data) {
        console.log('listbyDefenseId', data)
        res.render('faculty/panel-comment', {
          layout: 'faculty',
          data: data,
          defense_type: 'mor'
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/mor/grade/:defenseId/add-grades', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
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
                        res.redirect('/faculty/mor');
                      })
                  });
              })
          } else {
            console.log('sched  and panel data', req.body);
            res.redirect('/faculty/mor');
          }
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/mor/comments/:defenseId/add-comments', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('defenseId', req.params.defenseId);
    console.log('sched and panel data', req.body);
    // add function for changing grade and promoting to dp1
    Defense.addComments(req.params.defenseId, req.user.id, req.body.comment)
      .then(function (comments) {
        console.log('sched and panel data', req.body);
        res.redirect('/faculty/mor');
      });
  } else {
    res.redirect('/')
  }
});
// mor routes done

//dp1 routes start here
router.get('/dp1', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
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
            res.render('faculty/defense', {
              layout: 'faculty',
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
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('dp1', req.params.defenseId)
      .then(function (data) {
        console.log('listbyDefenseId', data)
        User.list('faculty')
        .then (function (faculties) {
          res.render('faculty/sched-panel', {
            layout: 'faculty',
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
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('sched and panel data', req.body.schedule, req.body.head_panel_id, req.body.faculty_id);
    // add function to update sched and create panel data
    Defense.createPanel(req.params.defenseId) // Can be improved by creating the panel at student choosing thesis for defense
      .then (function (panelId) {
        console.log('panelId', panelId)
        Defense.updateSchedAndPanel(panelId, req.params.defenseId, req.body.schedule, req.body.head_panel_id, req.body.faculty_id)
          .then (function (status) {
            console.log('status', status);
            res.redirect('/faculty/dp1');
          })
      });
  } else {
    res.redirect('/faculty/dp1')
  }
});

router.get('/dp1/details/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('dp1', req.params.defenseId)
      .then(function (data) {
        console.log('listbyDefenseId', data)
        Defense.listPanelMembers(req.params.defenseId)
          .then (function (panel_members) {
            console.log('panelmem', panel_members)
            res.render('faculty/defense_details', {
              layout: 'faculty',
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
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('dp1', req.params.defenseId)
      .then(function (data) {
        res.render('faculty/head_panel-grade', {
          layout: 'faculty',
          data: data,
          defense_type: 'dp1'
        });
      });
  } else {
    res.redirect('/')
  }
});

router.get('/dp1/comments/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('dp1', req.params.defenseId)
      .then(function (data) {
        console.log('listbyDefenseId', data)
        res.render('faculty/panel-comment', {
          layout: 'faculty',
          data: data,
          defense_type: 'dp1'
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/dp1/grade/:defenseId/add-grades', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
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
                        res.redirect('/faculty/dp1');
                      })
                  });
              })
          } else {
            console.log('sched  and panel data', req.body);
            res.redirect('/faculty/dp1');
          }
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/dp1/comments/:defenseId/add-comments', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('defenseId', req.params.defenseId);
    console.log('sched and panel data', req.body);
    // add function for changing grade and promoting to dp1
    Defense.addComments(req.params.defenseId, req.user.id, req.body.comment)
      .then(function (comments) {
        console.log('sched and panel data', req.body);
        res.redirect('/faculty/dp1');
      });
  } else {
    res.redirect('/')
  }
});

//dp1 ends here


//dp2 routes start here
router.get('/dp2', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
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
            res.render('faculty/defense', {
              layout: 'faculty',
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
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('dp2', req.params.defenseId)
      .then(function (data) {
        console.log('listbyDefenseId', data)
        User.list('faculty')
        .then (function (faculties) {
          res.render('faculty/sched-panel', {
            layout: 'faculty',
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
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('sched and panel data', req.body.schedule, req.body.head_panel_id, req.body.faculty_id);
    // add function to update sched and create panel data
    Defense.createPanel(req.params.defenseId) // Can be improved by creating the panel at student choosing thesis for defense
      .then (function (panelId) {
        console.log('panelId', panelId)
        Defense.updateSchedAndPanel(panelId, req.params.defenseId, req.body.schedule, req.body.head_panel_id, req.body.faculty_id)
          .then (function (status) {
            console.log('status', status);
            res.redirect('/faculty/dp2');
          })
      });
  } else {
    res.redirect('/faculty/dp2')
  }
});

router.get('/dp2/details/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('dp2', req.params.defenseId)
      .then(function (data) {
        console.log('listbyDefenseId', data)
        Defense.listPanelMembers(req.params.defenseId)
          .then (function (panel_members) {
            console.log('panelmem', panel_members)
            res.render('faculty/defense_details', {
              layout: 'faculty',
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
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('dp2', req.params.defenseId)
      .then(function (data) {
        res.render('faculty/head_panel-grade', {
          layout: 'faculty',
          data: data,
          defense_type: 'dp2'
        });
      });
  } else {
    res.redirect('/')
  }
});

router.get('/dp2/comments/:defenseId', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('defenseId', req.params.defenseId);
    Defense.listMorDp1Dp2ByDefenseId('dp2', req.params.defenseId)
      .then(function (data) {
        console.log('listbyDefenseId', data)
        res.render('faculty/panel-comment', {
          layout: 'faculty',
          data: data,
          defense_type: 'dp2'
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/dp2/grade/:defenseId/add-grades', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
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
                  res.redirect('/faculty/dp2');
                  });
              })
          } else {
            console.log('sched  and panel data', req.body);
            res.redirect('/faculty/dp2');
          }
        });
      });
  } else {
    res.redirect('/')
  }
});

router.post('/dp2/comments/:defenseId/add-comments', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    console.log('defenseId', req.params.defenseId);
    console.log('sched and panel data', req.body);
    // add function for changing grade and promoting to dp1
    Defense.addComments(req.params.defenseId, req.user.id, req.body.comment)
      .then(function (comments) {
        console.log('sched and panel data', req.body);
        res.redirect('/faculty/dp2');
      });
  } else {
    res.redirect('/')
  }
});

router.get('/finished', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    Defense.listFinishedThesis('done')
      .then(function(list) {
        console.log('list', list);
        res.render('faculty/finished', {
          layout: 'faculty',
          list: list
        });
      })
  } else {
    res.redirect('/')
  }
});

//dp2 ends here


module.exports = router;
