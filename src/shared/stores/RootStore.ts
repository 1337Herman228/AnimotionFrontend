import { BoardStore } from "./BoardStore";
import ProjectStore from "./ProjectStore";

class RootStore {
    projectStore: ProjectStore;
    boardStore: BoardStore;

    constructor() {
        this.projectStore = new ProjectStore();
        this.boardStore = new BoardStore();
    }
}

export default RootStore;
