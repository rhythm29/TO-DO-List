var user = JSON.parse(localStorage.getItem('userData'));
//console.log(user);

var userList = [];
var taskList = [];

function getUsers(){
    var welcome = document.getElementById('welcome');
    welcome.innerText = "Welcome " + user.name;
    
    var users = new XMLHttpRequest();
    users.open("GET","/api/users/"+ user.phone, true)
    users.setRequestHeader("content-type", "application/json");
    users.onreadystatechange = function(){
        if(users.readyState == 4 && users.status == 200){
            //console.log(users.responseText);
            userList = JSON.parse(users.responseText);
            console.log(users.responseText);
            assignNameTo(userList);
        }
    }
    users.send();
}

function assignNameTo(userList){
    var addName = document.getElementById("contacts");
    for(var i = 0; i< userList.length; i++){
        var option = document.createElement("option");
        option.setAttribute("id",userList[i].phone);
        option.setAttribute("value",userList[i].name);
        option.innerText = userList[i].name;
        console.log(userList[i].name)
        addName.appendChild(option);
    }
    getTasks();
}


function getTasks(){
    var tasks = new XMLHttpRequest();
    tasks.open("GET","api/tasks/"+user.phone,true)
    tasks.setRequestHeader("content-type", "application/json");
    tasks.onreadystatechange = function(){
        if(tasks.readyState == 4 && tasks.status == 200){
            taskList = JSON.parse(tasks.responseText);
            //console.log(tasks.responseText);
            if(tasks.responseText.length == 0){
                console.log("No Task Assigned");
            }
            showInTable();  
        }
         
    }
    tasks.send();
    
}

function createTask(){
    var newTask = {
        title: document.getElementById('name').value,
        date: document.getElementById('date').value,
        assgnByName: user.name,
        assgnByPhon: user.phone,
        assgnToName: document.getElementById("contacts").value,
        assgnToPhon: document.getElementById("hid").value
    }
    console.log(newTask);
    var task = new XMLHttpRequest();
    task.open("POST", "/api/tasks/", true);
    task.setRequestHeader("content-type", "application/json");
    task.onreadystatechange = function() {
            console.log(task.status);
            if(task.readyState == 4 && task.status == 200){
                console.log(task.responseText);         
                alert("Task added")
                window.location.reload();
            }
        }
        task.send(JSON.stringify(newTask));
}

function savePhone(abc){
    var options = abc.options;
    var id      = options[options.selectedIndex].id;
    var value   = options[options.selectedIndex].value;
    document.getElementById("hid").value = id;
    //console.log(id);
    //console.log(value)
}

function updateTask(el) {
    var task = taskList[el.id];
    console.log(task);
    var update = new XMLHttpRequest();
    task.data.status = false;
    update.open("PUT", "/api/tasks/", true);
    update.setRequestHeader("content-type", "application/json");
    update.onreadystatechange = function() {
        if (update.readyState == 4 && update.status == 200) {
            console.log("Task updated")
        }
        markIt(el);
    }
    update.send(JSON.stringify(task));
}

function markIt(el){
    el.setAttribute("class","strike");
}


function showInTable(){
    //var d = document.createElement('div');
    //d.setAttribute('id',mydiv);
    //document.body.appendChild(d);
    var x = document.createElement("TABLE");
    x.setAttribute('id', 'myTable');
    document.body.appendChild(x);
    //d.appendChild(x);
    
    var th1 = document.createElement('th');
    th1.innerText = "Task"
    th1.setAttribute('id', 'myTH1');

    var th2 = document.createElement('th');
    th2.innerText = "Date"
    th2.setAttribute('id', 'myTH1');

    var th3 = document.createElement('th');
    th3.innerText = "Assign To"
    th3.setAttribute('id', 'myTH1');

    var th4 = document.createElement('th');
    th4.innerText = "Status"
    th4.setAttribute('id', 'myTH1');


    x.appendChild(th1);
    x.appendChild(th2);
    x.appendChild(th3);
    x.appendChild(th4);

    for(var i = 0; i < taskList.length; i++){
        var tr = document.createElement('tr');
        tr.setAttribute('id', i);
                if(taskList[i].data.status == false){
                    markIt(tr);
                }
        var taskName = document.createElement('td');
        taskName.setAttribute('id', 'myTd1');
        taskName.innerText = taskList[i].data.title;
        tr.appendChild(taskName);

        var taskDate = document.createElement('td');
        taskDate.setAttribute('id', 'myTd1');
        taskDate.innerText = taskList[i].data.date;
        tr.appendChild(taskDate);

        var assignee = document.createElement('td');
        assignee.setAttribute('id', 'myTd1');
        assignee.innerText = taskList[i].data.assgnToName;
        tr.appendChild(assignee);

        var status = document.createElement('td');
        status.setAttribute('id', 'myTd1');
        status.innerText = taskList[i].data.status;
        tr.appendChild(status);

        tr.addEventListener("click",function(){updateTask(this);});
        x.appendChild(tr);

    }
}


    


