class ColumnApiEndpoints {
    private readonly BASE_URL = "/app/board";

    addColumn = () => `${this.BASE_URL}/add-column`;
    deleteColumn = () => `${this.BASE_URL}/delete-column`;
    editColumn = () => `${this.BASE_URL}/edit-column`;
    moveColumn = () => `${this.BASE_URL}/move-column`;

    get root() {
        return this.BASE_URL;
    }
}

export const columnApiEndpoints = new ColumnApiEndpoints();
