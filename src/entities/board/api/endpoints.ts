class BoardApiEndpoints {
    private readonly BASE_URL = "/projects";

    byId = (boardId: string) => `${this.BASE_URL}/${boardId}`;

    get root() {
        return this.BASE_URL;
    }
}

export const boardApiEndpoints = new BoardApiEndpoints();
