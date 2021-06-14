let filter = document.querySelectorAll('.filter_color');
let main = document.querySelector('.main_container');
let body = document.body;
let addIcon = document.querySelector('.fas.fa-plus');
let crossIcon = document.querySelector('.fas.fa-minus');

let deleteState = false;
let taskArr = [];

if(localStorage.getItem('allTask')){
    taskArr = JSON.parse(localStorage.getItem('allTask'));
    for(let i=0;i<taskArr.length;i++){
        let {id,color,task} = taskArr[i];;
        createTask(color,task,id,false);
    }
}

for(let i=0;i<filter.length;i++){
    filter[i].addEventListener('click',function(){
        let color = filter[i].classList[1];
        let taskFilter = document.querySelectorAll('.task_container>.task_filter');
        //console.log(taskFilter);
        for(let j=0;taskFilter.length && taskFilter[j]!=undefined;j++){
            let taskcolor = taskFilter[j].classList[1];
            let taskContainer = taskFilter[j].parentNode;
            if(color=='black'){
                taskContainer.style.opacity=1;
            }else{
                if(taskcolor==color){
                    taskContainer.style.opacity=1;
                }else{
                    taskContainer.style.opacity=0;
                }
            }
        }
    })
}

addIcon.parentNode.addEventListener('click', createModal);
crossIcon.parentNode.addEventListener('click',setDeleteState);


function createModal() {

    let modalContainer = document .querySelector('.modal_container');
    if(modalContainer==null){
        modalContainer = document.createElement('div');
        modalContainer.setAttribute('class', 'modal_container');
        modalContainer.innerHTML = `<div class ="input_container">
                        <textarea class="modal_input" placeholder="Enter Your text"></textarea>
                    </div>
                    <div class="modal_filter_container">
                        <div class="filter pink"></div>
                        <div class="filter blue"></div>
                        <div class="filter green"></div>
                        <div class="filter black"></div>
                    </div>`
        body.appendChild(modalContainer);
    }

    let textArea = modalContainer.querySelector('.modal_input');
    textArea.value = "";

    handelModal(modalContainer);
}

function handelModal(modal_container) {

    let filterColor = document.querySelectorAll('.modal_filter_container>.filter');
    filterColor[3].classList.add('border');
    let currcolor = filterColor[3];
    for (let i = 0; i < filterColor.length; i++) {
        filterColor[i].addEventListener('click', function () {
            currcolor.classList.remove('border');
            filterColor[i].classList.add('border');
            currcolor = filterColor[i];
        })
    }

    let textArea = document.querySelector('.modal_input');
    textArea.addEventListener('keydown', function (e) {
        
        if (e.key == 'Enter' && textArea.value.trim()!=="") {
            //console.log("Task ",textArea.value," color ",currcolor.classList[1]);

            body.removeChild(modal_container);
            createTask(currcolor.classList[1],textArea.value,null,true);
        }
    } )

    main.addEventListener('click', function(){
        modal_container.remove();
    } )
}

function createTask(color, task,id,flag) {

    let taskContainer = document.createElement('div');
    let uifn = new ShortUniqueId();
    let uid = id||uifn();
    taskContainer.setAttribute('class', 'task_container');
    taskContainer.innerHTML = `<div class="task_filter ${color}"></div>
    <div class="task_desc_container">
        <h3 class="uid">#${uid}</h3>
        <div class="task_desc" contenteditable="true">${task}</div>
    </div>
</div>`;

    main.appendChild(taskContainer);

    if(flag){
        let obj = {
            id:uid,
            color:color,
            task:task
        };
        taskArr.push(obj);
        localStorage.setItem('allTask',JSON.stringify(taskArr));
    }

    let taskFilter = taskContainer.querySelector('.task_filter');
    let taskDesc = taskContainer.querySelector('.task_desc');
    // console.log(colorContainer);
    //for changing color

    taskFilter.addEventListener('click', changeColor);  
    taskContainer.addEventListener('click',deleteTask); 
    taskDesc.addEventListener('click',changeTask);     
}

function changeColor(e){

    //e.currentTarget this returns the node on which addEventListner is associated
    //e.target this returns on which mouse is actually clicked or for which event has occured
    // console.log(e.currentTarget);
    // console.log(e.target);
    let taskFilter =  e.currentTarget;
    let colorArr = ["pink","blue","green","black"];
    let cColor = taskFilter.classList[1];
    let idx = colorArr.indexOf(cColor);
    let newColor = colorArr[(idx+1)%4];
    taskFilter.classList.remove(cColor);
    taskFilter.classList.add(newColor);
    let taskContainer = taskFilter.parentNode;
    let uid = taskContainer.querySelector('.uid').innerText;
    for(let i=0;i<taskArr.length;i++){
        let id = taskArr[i].id;
        //console.log(id);
        if(`#${id}`==uid){
            taskArr[i].color = newColor;
            localStorage.setItem("allTask",JSON.stringify(taskArr));
        }
    }


}

function setDeleteState(e){
    let cross = e.currentTarget;
    // let parent = cross.parentNode;
    if(deleteState==false){
        cross.classList.add('active');
    }else{
        cross.classList.remove('active');
    }
    deleteState=!deleteState;
}

function deleteTask(e){
    let currTask = e.currentTarget;
    if(deleteState){
        let uidElem = currTask.querySelector('.uid');
        let uid = uidElem.innerText;
        //console.log(uid);
        for(let i=0;i<taskArr.length;i++){
            let id = taskArr[i].id;
            //console.log(id);
            if(`#${id}`==uid){
                taskArr.splice(i,1);
                localStorage.setItem("allTask",JSON.stringify(taskArr));
                currTask.remove();
            }
        }
    }
}

function changeTask(e){
    let taskDesc = e.currentTarget;
    //console.log(taskDesc);
    let task = taskDesc.innerText;
    //console.log(task);
    let parent = taskDesc.parentNode;
    let uid = parent.querySelector('.uid').innerText;
    //console.log(uid);
    for(let i=0;i<taskArr.length;i++){
        let id = taskArr[i].id;
        //console.log(id);
        if(`#${id}`==uid){
            taskArr[i].task = task;
            localStorage.setItem("allTask",JSON.stringify(taskArr));
        }
    }

}


