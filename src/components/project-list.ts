import { Component } from "./base-component";
import { ProjectItem } from "./project-item";
import { Project } from "project";
import { ProjectType, projectState } from "../states/project-state";
import { DragTarget } from "../interfaces/draggable";

export class ProjectList extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget {
  assignedProjects: Project[];

  constructor(private type: ProjectType) {
    super("project-list", "app", "beforeend", type + "-projects");
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "plain/text") {
      event.preventDefault();
      const list$ = this.element.querySelector("ul");
      list$?.classList.add("droppable");
    }
  }
  dragLeaveHandler(event: DragEvent) {
    const list$ = this.element.querySelector("ul");
    list$?.classList.remove("droppable");
  }
  dropHandler(event: DragEvent) {
    const projId = event.dataTransfer!.getData("plain/text");
    console.log("project id to move:", projId, this.type);
    projectState.moveProject(projId, this.type);
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
    this.element.addEventListener("dragover", this.dragOverHandler.bind(this));
    this.element.addEventListener(
      "dragleave",
      this.dragLeaveHandler.bind(this)
    );
    this.element.addEventListener("drop", this.dropHandler.bind(this));
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
