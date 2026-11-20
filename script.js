let tasks = []; 
let currentFilter = "all"; 
let counter = 1000; 
const clientInput = document.getElementById("clientInput"); 
const titleInput = document.getElementById("titleInput"); 
const categoryInput = document.getElementById("categoryInput"); 
const areaInput = document.getElementById("areaInput"); 
const docInput = document.getElementById("docInput"); 
const priorityInput = document.getElementById("priorityInput"); 
const dateInput = document.getElementById("dateInput"); 
const notesInput = document.getElementById("notesInput"); 
const errorMsg = document.getElementById("errorMsg"); 
 
 
 
const addBtn = document.getElementById("addBtn"); 
const searchInput = document.getElementById("searchInput"); 
const sortInput = document.getElementById("sortInput"); 
const clearBtn = document.getElementById("clearBtn"); 
const taskList = document.getElementById("taskList"); 
const filterButtons = document.querySelectorAll(".filterBtn"); 
 
function todayString() { 
    const d = new Date(); 
    const month = String(d.getMonth() + 1).padStart(2, "0"); 
    const day = String(d.getDate()).padStart(2, "0"); 
    return d.getFullYear() + "-" + month + "-" + day; 
} 
 
function isOverdue(task) { 
    return !task.done && task.date !== "" && task.date < todayString(); 
} 
 
function saveData() { 
    try { 
        localStorage.setItem("legalSphereTasks", JSON.stringify(tasks)); 
        localStorage.setItem("legalSphereCounter", String(counter)); 
    } catch (e) { 
    } 
} 
 
function loadData() { 
    try { 
        const saved = localStorage.getItem("legalSphereTasks"); 
        const savedCounter = localStorage.getItem("legalSphereCounter"); 
        if (saved) tasks = JSON.parse(saved); 
        if (savedCounter) counter = parseInt(savedCounter, 10); 
    } catch (e) { 
        tasks = []; 
    } 
} 
 
function addTask() { 
    const client = clientInput.value.trim(); 
    const title = titleInput.value.trim(); 
 
    if (client === "" || title === "") { 
        errorMsg.textContent = "Client name and task title are required."; 
        return; 
    } 
    if (client.length < 3) { 
        errorMsg.textContent = "Client name must be at least 3 characters."; 
        return; 
    } 
    errorMsg.textContent = ""; 
 
    counter++; 
    tasks.push({ 
        id: counter, 
        caseId: "LS-" + counter, 
        client: client, 
        title: title, 
 
 
        category: categoryInput.value, 
        area: areaInput.value, 
        document: docInput.value, 
        priority: priorityInput.value, 
        date: dateInput.value, 
        notes: notesInput.value.trim(), 
        done: false 
    }); 
 
    clientInput.value = ""; 
    titleInput.value = ""; 
    notesInput.value = ""; 
    dateInput.value = ""; 
    categoryInput.selectedIndex = 0; 
    areaInput.selectedIndex = 0; 
    docInput.selectedIndex = 0; 
    priorityInput.value = "medium"; 
    clientInput.focus(); 
 
    saveData(); 
    render(); 
} 
 
function toggleTask(id) { 
    tasks.forEach(function (t) { 
        if (t.id === id) t.done = !t.done; 
    }); 
    saveData(); 
    render(); 
} 
 
function deleteTask(id) { 
    if (!confirm("Delete this task permanently?")) return; 
    tasks = tasks.filter(function (t) { 
        return t.id !== id; 
    }); 
    saveData(); 
    render(); 
} 
 
function clearCompleted() { 
    const hasDone = tasks.some(function (t) { return t.done; }); 
    if (!hasDone) return; 
    if (!confirm("Remove all completed tasks?")) return; 
    tasks = tasks.filter(function (t) { 
        return !t.done; 
    }); 
    saveData(); 
    render(); 
} 
 
function getVisibleTasks() { 
    const search = searchInput.value.trim().toLowerCase(); 
 
    let list = tasks.filter(function (t) { 
        let passFilter = true; 
        if (currentFilter === "pending") passFilter = !t.done; 
 
 
        else if (currentFilter === "completed") passFilter = t.done; 
        else if (currentFilter === "overdue") passFilter = isOverdue(t); 
        else if (currentFilter !== "all") passFilter = t.category === currentFilter; 
 
        const text = (t.client + " " + t.title + " " + t.caseId).toLowerCase(); 
        return passFilter && text.includes(search); 
    }); 
 
    const order = { high: 1, medium: 2, low: 3 }; 
    const sortType = sortInput.value; 
 
    list.sort(function (a, b) { 
        if (sortType === "date") { 
            if (a.date === "") return 1; 
            if (b.date === "") return -1; 
            return a.date.localeCompare(b.date); 
        } 
        if (sortType === "priority") { 
            return order[a.priority] - order[b.priority]; 
        } 
        return b.id - a.id; 
    }); 
 
    return list; 
} 
 
function updateCards() { 
    const done = tasks.filter(function (t) { return t.done; }).length; 
    const overdue = tasks.filter(isOverdue).length; 
    document.getElementById("totalCount").textContent = tasks.length; 
    document.getElementById("pendingCount").textContent = tasks.length - done; 
    document.getElementById("doneCount").textContent = done; 
    document.getElementById("overdueCount").textContent = overdue; 
} 
 
function makeBadge(text, extraClass) { 
    const span = document.createElement("span"); 
    span.className = "badge " + extraClass; 
    span.textContent = text; 
    return span; 
} 
 
function render() { 
    taskList.innerHTML = ""; 
    const visible = getVisibleTasks(); 
 
    if (visible.length === 0) { 
        const empty = document.createElement("div"); 
        empty.className = "empty"; 
        empty.textContent = "No tasks found."; 
        taskList.appendChild(empty); 
    } 
 
    visible.forEach(function (t) { 
        const li = document.createElement("li"); 
        li.classList.add("task", t.priority); 
        if (t.done) li.classList.add("done"); 
 
 
 
        const info = document.createElement("div"); 
 
        const top = document.createElement("div"); 
        top.className = "top"; 
 
        const caseId = document.createElement("span"); 
        caseId.className = "caseId"; 
        caseId.textContent = t.caseId; 
 
        const title = document.createElement("span"); 
        title.className = "title"; 
        title.textContent = t.title; 
 
        top.appendChild(caseId); 
        top.appendChild(title); 
        top.appendChild(makeBadge(t.category, t.category === "Legal Advisory" ? "advisory" : 
"documentation")); 
        if (t.done) top.appendChild(makeBadge("Completed", "completed")); 
        if (isOverdue(t)) top.appendChild(makeBadge("Overdue", "overdue")); 
 
        const meta = document.createElement("div"); 
        meta.className = "meta"; 
        const due = t.date === "" ? "No due date" : "Due: " + t.date; 
        const docText = t.document === "Not Applicable" ? "" : " | Document: " + t.document; 
        meta.textContent = "Client: " + t.client + " | " + t.area + docText + " | " + due + " | Priority: " 
+ t.priority; 
 
        info.appendChild(top); 
        info.appendChild(meta); 
 
        if (t.notes !== "") { 
            const notes = document.createElement("div"); 
            notes.className = "notes"; 
            notes.textContent = "Note: " + t.notes; 
            info.appendChild(notes); 
        } 
 
        const actions = document.createElement("div"); 
        actions.className = "actions"; 
 
        const doneBtn = document.createElement("button"); 
        doneBtn.textContent = t.done ? "Reopen" : "Mark Done"; 
        doneBtn.addEventListener("click", function () { 
            toggleTask(t.id); 
        }); 
 
        const delBtn = document.createElement("button"); 
        delBtn.className = "delete"; 
        delBtn.textContent = "Delete"; 
        delBtn.addEventListener("click", function () { 
            deleteTask(t.id); 
        }); 
 
        actions.appendChild(doneBtn); 
        actions.appendChild(delBtn); 
 
 
li.appendChild(info); 
li.appendChild(actions); 
taskList.appendChild(li); 
}); 
updateCards(); 
} 
addBtn.addEventListener("click", addTask); 
clearBtn.addEventListener("click", clearCompleted); 
searchInput.addEventListener("input", render); 
sortInput.addEventListener("change", render); 
titleInput.addEventListener("keydown", function (e) { 
if (e.key === "Enter") addTask(); 
}); 
filterButtons.forEach(function (btn) { 
btn.addEventListener("click", function () { 
filterButtons.forEach(function (b) { 
b.classList.remove("active"); 
}); 
btn.classList.add("active"); 
currentFilter = btn.getAttribute("data-filter"); 
render(); 
}); 
}); 
document.getElementById("today").textContent = new Date().toDateString(); 
dateInput.min = todayString(); 
loadData(); 
render(); 
