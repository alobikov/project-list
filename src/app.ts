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

class ProjectInput {
  templateElm: HTMLTemplateElement;
  hostElm: HTMLDivElement;
  element: HTMLFormElement;
  titleInput$: HTMLInputElement;
  descriptionInput$: HTMLInputElement;
  peopleInput$: HTMLInputElement;

  constructor() {
    this.templateElm = document.getElementById(
      "project-input"
    ) as HTMLTemplateElement;
    this.hostElm = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.templateElm.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.titleInput$ = this.element.querySelector(
      ".form-control #title"
    )! as HTMLInputElement;
    this.descriptionInput$ = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInput$ = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;

    console.log("title", this.titleInput$);
    this.bindControl();
    this.attach();
  }

  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) console.log(userInput);
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
  private bindControl() {
    this.element.addEventListener("submit", this.submitHandler.bind(this));
  }

  private attach() {
    this.hostElm.insertAdjacentElement("afterbegin", this.element);
  }
}

const project = new ProjectInput();
