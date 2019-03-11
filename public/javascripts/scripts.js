$( document ).ready(function() {

  // adding students to a class
  $('#save-class-students').click(function() {
    var class_id = $('#student-list').data('class-id');
    var selectedStudents = $('#student-list').val()
    console.log('selected', selectedStudents)
    $('#add-students').modal('hide');
    var postApi = `/api/class/${class_id}/student`
    $.post(postApi, {
      data: JSON.stringify({
        student_ids: selectedStudents
      })
    }).then(function(res) {
      console.log("added student");
      window.location.reload();
    })
  }),

// adding students to a group
  $('#save-group-students').click(function() {
    var group_id = $('#student-list').data('group-id');
    var selectedStudents = $('#student-list').val();
    console.log('group_id', group_id);
    console.log('selected', selectedStudents);
    $('#add-students').modal('hide');
    var postApi = `/api/group/${group_id}/student` // group
    $.post(postApi, {
      data: JSON.stringify({
        student_ids: selectedStudents
      })
    }).then(function(res) {
      console.log("added student");
      window.location.reload();
    })
  }),

  // adding faculty to committee
  $('#save-committee-members').click(function() {
    // var group_id = $('#faculty-list').data('group-id'); // remove
    var selectedFaculty = $('#faculty-list').val();
    // console.log('group_id', group_id);
    console.log('selected', selectedFaculty);
    $('#add-committee-members').modal('hide');
    var postApi = `/api/committee/faculty` // group
    $.post(postApi, {
      data: JSON.stringify({
        faculty_ids: selectedFaculty
      })
    }).then(function(res) {
      console.log("added student");
      window.location.reload();
    })
  })
});