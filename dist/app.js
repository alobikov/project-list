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
class ProjectInput {
    constructor() {
        this.templateElm = document.getElementById("project-input");
        this.hostElm = document.getElementById("app");
        const importedNode = document.importNode(this.templateElm.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = "user-input";
        this.titleInput$ = this.element.querySelector(".form-control #title");
        this.descriptionInput$ = this.element.querySelector("#description");
        this.peopleInput$ = this.element.querySelector("#people");
        console.log("title", this.titleInput$);
        this.bindControl();
        this.attach();
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput))
            console.log(userInput);
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
    bindControl() {
        this.element.addEventListener("submit", this.submitHandler.bind(this));
    }
    attach() {
        this.hostElm.insertAdjacentElement("afterbegin", this.element);
    }
}
const project = new ProjectInput();
//# sourceMappingURL=app.js.map