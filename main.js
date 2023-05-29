$(document).ready(function () {
  /*
  on load function to be called 
  @For load tasks
  @For set status code in local storage 
  */
  setStatusCode();
  loadTasks();

  // For input field style
  document.querySelectorAll(".form-outline").forEach((formOutline) => {
    new mdb.Input(formOutline).update();
  });

  /*
  @ if status is 1 add new task
  @ else Edit task 
  @ For Id used date as it will be unique
  */
  $("#taskSubmitBtn").on("click", function (e) {
    e.preventDefault();

    if (
      $("#taskSubmitBtn").attr("dataStatus") == 1 ||
      $("#taskSubmitBtn").attr("dataStatus") == "1"
    ) {
      var newTask = {
        id: new Date().getTime(),
        title: $("#taskTitleForm").val(),
        status: $("#taskStatusFrom").val(),
        createdDate: new Date().toUTCString().slice(5, 16),
      };

      addTask(newTask);
    } else {
      var editedTask = {
        id: $("#taskSubmitBtn").attr("dataId"),
        title: $("#taskTitleForm").val(),
        status: $("#taskStatusFrom").val(),
        createdDate: new Date().toUTCString().slice(5, 16),
      };

      updateTask(editedTask);
    }

    $("#exampleModal").modal("hide");
    $("#taskTitleForm").val("");
    $("#taskStatusFrom").val(1).change();
    $("#taskSubmitBtn").text("Add Task");
    $("#taskSubmitBtn").attr("dataId", 0);
  });

  /*
  @ filter table base on status code
  */
  $("#sortByStatus").on("change", function () {
    loadTasks($(this).val());
  });

  /*
  @ Set status code in local storage
  */
  function setStatusCode() {
    var statusCode = [
      {
        id: 1,
        status: "Active",
        color: "primary",
      },
      {
        id: 2,
        status: "Hold",
        color: "warning",
      },
      {
        id: 3,
        status: "Deleted",
        color: "danger ",
      },
      {
        id: 4,
        status: "Compeleted",
        color: "success ",
      },
    ];
    localStorage.setItem("statusCode", JSON.stringify(statusCode));
  }

  /*
  @ Load task if there is in loacl storage 
  @If new task added update the table
  @If task updated , update the table
  */
  function loadTasks(statusId = 0) {
    var tasks = getTasks();
    var statusCode = getStatus();

    var tableHtml = "";

    if (statusId != 0) {
      tasks = tasks.filter((i) => i.status == statusId);
    }
    if (tasks.length) {
      for (var i = 0; i < tasks.length; i++) {
        var statusName = "",
          statusColor = "";

        for (var j = 0; j < statusCode.length; j++) {
          if (statusCode[j].id == tasks[i].status) {
            statusName = statusCode[j].status;
            statusColor = statusCode[j].color;
          }
        }

        tableHtml += `<tr dataId="${tasks[i].id}" dataTitle="${
          tasks[i].title
        }" dataStatus="${tasks[i].status}">
              <td>${i + 1}</td>
              <td>
                <p class="fw-normal mb-1 title">${tasks[i].title}</p>
              </td>
              <td class="text-center">
                <span class="badge badge-${statusColor} rounded-pill d-inline"
                  >${statusName}</span
                >
              </td>
              <td class="text-center">
                <a style="cursor: pointer;"><i
                  class="fas fa-pen-to-square fa-lg text-success mx-2"
                ></i></a>
                <a style="cursor: pointer;"><i class="fas fa-trash fa-lg text-danger mx-2"></i></a>
              </td>
              <td class="text-center">${tasks[i].createdDate}</td>
            </tr>`;
      }
    } else {
      tableHtml += `<tr>
                    <td colspan="5" class="text-center">No tasks are Added !!</td>
                  </tr>`;
    }

    $("#taskBody").html(tableHtml);

    /*
    @ on click trash(delete icon) delete task
    */
    $(".fa-trash").on("click", function () {
      var id = $(this).closest("tr").attr("dataId");
      deleteTask(id);
    });

    /*
    @ on click Pen(edit icon) edit task
    */
    $(".fa-pen-to-square").on("click", function () {
      var tr = $(this).closest("tr");

      $("#taskTitleForm").val(tr.attr("dataTitle"));
      $("#taskStatusFrom").val(tr.attr("dataStatus")).change();
      $("#taskSubmitBtn").text("Save");
      $("#taskSubmitBtn").attr("dataStatus", 2);
      $("#taskSubmitBtn").attr("dataId", tr.attr("dataId"));

      $("#exampleModal").modal("show");
    });
  }

  /*
  @ Add new task function
  */
  function addTask(newTask) {
    var tasks = getTasks();

    tasks.push(newTask);
    setLocalStorage(tasks);
  }

  /*
  @ Delete task function by Id
  */
  function deleteTask(taskId) {
    var tasks = getTasks();

    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id == taskId) {
        tasks.splice(i, 1);
        break;
      }
    }

    setLocalStorage(tasks);
  }

  /*
  @ Update task function by Id
  */
  function updateTask(task) {
    var tasks = getTasks();

    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id == task.id) {
        tasks[i].title = task.title;
        tasks[i].status = task.status;
        break;
      }
    }
    setLocalStorage(tasks);
  }

  /*
  @ Get task list from local storage
  */
  function getTasks() {
    return localStorage.getItem("tasks") != undefined
      ? JSON.parse(localStorage.getItem("tasks"))
      : [];
  }

  /*
  @ Set Task list in local Storage
  */
  function setLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  }

  /*
  @ Get status code from local Storage
  */
  function getStatus() {
    return localStorage.getItem("statusCode") != undefined
      ? JSON.parse(localStorage.getItem("statusCode"))
      : [];
  }
});
