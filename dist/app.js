"use strict";
function validate(validInput) {
    let isValid = true;
    // check for input in general
    if (validInput.required) {
        isValid = isValid && validInput.value.toString().length != 0;
    }
    if (validInput.minLength != null && typeof validInput.value === "string") {
        isValid = isValid && validInput.value.length >= validInput.minLength;
    }
    if (validInput.maxLength != null && typeof validInput.value === "string") {
        isValid = isValid && validInput.value.length <= validInput.maxLength;
    }
    if (validInput.min != null && typeof validInput.value === "number") {
        isValid = isValid && validInput.value >= validInput.min;
    }
    if (validInput.max != null && typeof validInput.value === "number") {
        isValid = isValid && validInput.value <= validInput.max;
    }
    return isValid;
}
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        else {
            this.instance = new ProjectState();
            return this.instance;
        }
    }
    addProject(title, description, numOfPeople) {
        const project = new Project(Math.random().toString().replace(".", ""), title, description, numOfPeople, ProjectType.Active);
        this.projects.push(project);
        // execute all listeners
        this.listeners.forEach((func) => {
            func(this.projects.slice());
        });
        this.showProjects();
    }
    moveProject(projectId, newType) {
        const proj = this.projects.find((project) => project.id === projectId);
        if (proj && proj.type !== newType) {
            proj.type = newType;
            console.log({ newType });
            this.listeners.forEach((func) => {
                func(this.projects.slice());
            });
        }
        this.showProjects();
    }
    showProjects() {
        console.log("we have next projects");
        this.projects.forEach((item) => {
            console.log(item);
        });
    }
    set(array) {
        this.projects = array;
        console.log(this.projects);
    }
}
const projectState = ProjectState.getInstance();
var ProjectType;
(function (ProjectType) {
    ProjectType["Active"] = "active";
    ProjectType["Finished"] = "finished";
})(ProjectType || (ProjectType = {}));
class Project {
    constructor(id, title, description, numOfPeople, type) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.numOfPeople = numOfPeople;
        this.type = type;
    }
}
class Component {
    constructor(templateId, hostElmId, attachPoint, newElementId) {
        this.templateElm = document.getElementById(templateId);
        this.hostElm = document.getElementById(hostElmId);
        const importedNode = document.importNode(this.templateElm.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attachElmToHostElm(attachPoint);
    }
    attachElmToHostElm(attachPoint) {
        this.hostElm.insertAdjacentElement(attachPoint, this.element);
        console.log(this);
    }
}
class ProjectItem extends Component {
    constructor(hostElmId, project) {
        super("single-project", hostElmId, "beforeend", project.id);
        this.project = project;
        this.configure();
        this.renderContent();
    }
    get persons() {
        if (this.project.numOfPeople === 1) {
            return "1 person";
        }
        else {
            return `${this.project.numOfPeople} persons`;
        }
    }
    dragStartHandler(event) {
        event.dataTransfer.setData("plain/text", this.project.id);
        event.dataTransfer.effectAllowed = "move";
    }
    dragEndHandler(event) {
        console.log("dragEnd");
    }
    configure() {
        this.element.addEventListener("dragstart", this.dragStartHandler.bind(this));
        this.element.addEventListener("dragend", this.dragEndHandler.bind(this));
    }
    renderContent() {
        console.log("renderContent", this.element);
        this.element.querySelector("h2").textContent = this.project.title;
        this.element.querySelector("h3").textContent = this.persons + " assigned";
        this.element.querySelector("p").textContent = this.project.description;
    }
}
class ProjectList extends Component {
    constructor(type) {
        super("project-list", "app", "beforeend", type + "-projects");
        this.type = type;
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === "plain/text") {
            event.preventDefault();
            const list$ = this.element.querySelector("ul");
            list$ === null || list$ === void 0 ? void 0 : list$.classList.add("droppable");
        }
    }
    dragLeaveHandler(event) {
        const list$ = this.element.querySelector("ul");
        list$ === null || list$ === void 0 ? void 0 : list$.classList.remove("droppable");
    }
    dropHandler(event) {
        const projId = event.dataTransfer.getData("plain/text");
        console.log("project id to move:", projId, this.type);
        projectState.moveProject(projId, this.type);
    }
    renderProjects() {
        const ul$ = document.getElementById(this.type + "-projects-list");
        ul$.innerHTML = "";
        this.assignedProjects.forEach((project) => {
            if (project.type === this.type) {
                console.log(this.element.id);
                new ProjectItem(this.element.querySelector("ul").id, project);
                // const li$ = document.createElement("li");
                // li$.textContent = project.title;
                // ul$.appendChild(li$);
            }
        });
    }
    configure() {
        this.element.addEventListener("dragover", this.dragOverHandler.bind(this));
        this.element.addEventListener("dragleave", this.dragLeaveHandler.bind(this));
        this.element.addEventListener("drop", this.dropHandler.bind(this));
        // this adds function to the list of functions which will be executed,
        // whenever new project added via UI.
        projectState.addListener((projects) => {
            const listProjects = projects.filter((project) => {
                if (this.type === ProjectType.Active) {
                    return project.type === ProjectType.Active;
                }
                else {
                    return project.type === ProjectType.Finished;
                }
            });
            this.assignedProjects = listProjects;
            this.renderProjects();
        });
    }
    renderContent() {
        this.element.querySelector("ul").id = `${this.type}-projects-list`;
        this.element.querySelector("h2").textContent = `${this.type.toUpperCase()} PROJECTS`;
    }
}
//==================================================================================
class ProjectInput extends Component {
    constructor() {
        super("project-input", "app", "afterbegin", "user-input");
        this.titleInput$ = this.element.querySelector(".form-control #title");
        this.descriptionInput$ = this.element.querySelector("#description");
        this.peopleInput$ = this.element.querySelector("#people");
        this.configure();
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            console.log(userInput);
            projectState.addProject(...userInput);
            projectState.showProjects();
        }
    }
    gatherUserInput() {
        const enteredTitle = this.titleInput$.value.trim();
        const enteredDescription = this.descriptionInput$.value.trim();
        const enteredPeople = +this.peopleInput$.value.trim();
        const titleValidator = {
            value: enteredTitle,
            required: true,
            minLength: 3,
            maxLength: 23,
        };
        const descriptionValidator = {
            value: enteredDescription,
            required: true,
            minLength: 5,
        };
        const peopleValidator = {
            value: enteredPeople,
            required: true,
            min: 1,
            max: 5,
        };
        if (!validate(titleValidator) ||
            !validate(descriptionValidator) ||
            !validate(peopleValidator)) {
            console.log("Incomplete input");
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler.bind(this));
    }
    renderContent() { }
}
const project = new ProjectInput();
const activeProject = new ProjectList(ProjectType.Active);
const finishedProject = new ProjectList(ProjectType.Finished);
//# sourceMappingURL=app.js.map