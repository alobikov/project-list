import { Component } from "./base-component";
import { projectState } from "../states/project-state";
import { validate, ValidInput } from "../utils/validate";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
