import { ProjectInput } from "./components/project-input";
import { ProjectList } from "./components/project-list";
import { ProjectType } from "./states/project-state";

new ProjectInput();
new ProjectList(ProjectType.Active);
new ProjectList(ProjectType.Finished);
