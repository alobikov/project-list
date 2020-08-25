import { ProjectType } from "../states/project-state";

export class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public numOfPeople: number,
    public type: ProjectType
  ) {}
}
