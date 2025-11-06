class BoardApiEndpoints {
    private readonly BASE_URL = "/boards";

    byId = (projectId: string) => `${this.BASE_URL}/${projectId}`;

    get root() {
        return this.BASE_URL;
    }
}

export const boardApiEndpoints = new BoardApiEndpoints();
