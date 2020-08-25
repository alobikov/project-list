import { Project } from "project";
import { Component } from "./base-component";
import { Draggable } from "../interfaces/draggable";

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable {
  project: Project;

  get persons(): string {
    if (this.project.numOfPeople === 1) {
      return "1 person";
    } else {
      return `${this.project.numOfPeople} persons`;
    }
  }

  constructor(hostElmId: string, project: Project) {
    super("single-project", hostElmId, "beforeend", project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("plain/text", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }
  dragEndHandler(event: DragEvent) {
    console.log("dragEnd");
  }

  configure() {
    this.element.addEventListener(
      "dragstart",
      this.dragStartHandler.bind(this)
    );
    this.element.addEventListener("dragend", this.dragEndHandler.bind(this));
  }
  renderContent() {
    console.log("renderContent", this.element);
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
