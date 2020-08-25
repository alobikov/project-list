interface ValidInput {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validInput: ValidInput): boolean {
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

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[];

  private static instance: ProjectState;

  static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      this.instance = new ProjectState();
      return this.instance;
    }
  }
  private constructor() {
    super();
    this.projects = [];
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const project: Project = new Project(
      Math.random().toString().replace(".", ""),
      title,
      description,
      numOfPeople,
      ProjectType.Active
    );
    this.projects.push(project);

    // execute all listeners
    this.listeners.forEach((func) => {
      func(this.projects.slice());
    });
  }

  showProjects() {
    this.projects.forEach((item) => {
      console.log(item);
    });
  }

  set(array: any[]) {
    this.projects = array;
    console.log(this.projects);
  }
}
const projectState = ProjectState.getInstance();

enum ProjectType {
  Active = "active",
  Finished = "finished",
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public numOfPeople: number,
    public type: ProjectType
  ) {}
}

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElm: HTMLTemplateElement;
  hostElm: T;
  element: U; // as there is no HTMLSectionElement
  constructor(
    templateId: string,
    hostElmId: string,
    attachPoint: InsertPosition,
    newElementId?: string
  ) {
    this.templateElm = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElm = document.getElementById(hostElmId)! as T;
    const importedNode = document.importNode(this.templateElm.content, true);
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attachElmToHostElm(attachPoint);
  }
  private attachElmToHostElm(attachPoint: InsertPosition) {
    this.hostElm.insertAdjacentElement(attachPoint, this.element);
    console.log(this);
  }
  abstract configure(): void;
  abstract renderContent(): void;
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  project: Project;
  constructor(hostElmId: string, project: Project) {
    super("single-project", hostElmId, "beforeend", project.id);
    this.project = project;
    this.renderContent();
  }
  configure() {}
  renderContent() {
    console.log("renderContent", this.element);
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector(
      "h3"
    )!.textContent = this.project.numOfPeople.toString();
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: ProjectType) {
    super("project-list", "app", "beforeend", type + "-projects");
    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  renderProjects() {
    const ul$ = document.getElementById(
      this.type + "-projects-list"
    )! as HTMLUListElement;
    ul$.innerHTML = "";
    this.assignedProjects.forEach((project) => {
      if (project.type === this.type) {
        console.log(this.element.id);
        new ProjectItem(this.element.querySelector("ul")!.id, project);
        // const li$ = document.createElement("li");
        // li$.textContent = project.title;
        // ul$.appendChild(li$);
      }
    });
  }

  configure() {
    // this adds function to the list of functions which will be executed,
    // whenever new project added via UI.
    projectState.addListener((projects: Project[]) => {
      const listProjects = projects.filter((project) => {
        if (this.type === ProjectType.Active) {
          return project.type === ProjectType.Active;
        } else {
          return project.type === ProjectType.Finished;
        }
      });
      this.assignedProjects = listProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    this.element.querySelector("ul")!.id = `${this.type}-projects-list`;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }
}

//==================================================================================
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInput$: HTMLInputElement;
  descriptionInput$: HTMLInputElement;
  peopleInput$: HTMLInputElement;

  constructor() {
    super("project-input", "app", "afterbegin", "user-input");

    this.titleInput$ = this.element.querySelector(
      ".form-control #title"
    )! as HTMLInputElement;
    this.descriptionInput$ = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInput$ = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
  }

  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      console.log(userInput);
      projectState.addProject(...userInput);
      projectState.showProjects();
    }
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInput$.value.trim();
    const enteredDescription = this.descriptionInput$.value.trim();
    const enteredPeople = +this.peopleInput$.value.trim();

    const titleValidator: ValidInput = {
      value: enteredTitle,
      required: true,
      minLength: 3,
      maxLength: 23,
    };

    const descriptionValidator: ValidInput = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const peopleValidator: ValidInput = {
      value: enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidator) ||
      !validate(descriptionValidator) ||
      !validate(peopleValidator)
    ) {
      console.log("Incomplete input");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }
  configure() {
    this.element.addEventListener("submit", this.submitHandler.bind(this));
  }

  renderContent() {}
}

const project = new ProjectInput();
const activeProject = new ProjectList(ProjectType.Active);
const finishedProject = new ProjectList(ProjectType.Finished);
