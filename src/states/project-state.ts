import { Project } from "../components/project";
import { compilation } from "webpack";

type Listener<T> = (items: T[]) => void;

export enum ProjectType {
  Active = "active",
  Finished = "finished",
}

class State<T> {
  protected listeners: Listener<T>[] = [];
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project> {
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
    this.showProjects();
  }

  moveProject(projectId: string, newType: ProjectType) {
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

  set(array: any[]) {
    this.projects = array;
    console.log(this.projects);
  }
}
export const projectState = ProjectState.getInstance();
