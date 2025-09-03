import ProjectStore from "./ProjectStore";

class RootStore {
    projectStore: ProjectStore;

    constructor() {
        this.projectStore = new ProjectStore();
    }
}

export default RootStore;
