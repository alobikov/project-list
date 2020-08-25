export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
