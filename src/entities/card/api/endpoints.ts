class CardApiEndpoints {
    // private readonly BASE_URL = "/app/board";
    private readonly BASE_URL = "/boards";

    addCard = () => `${this.BASE_URL}/add-card`;
    deleteCard = (id: string) => `${this.BASE_URL}/delete-card/${id}`;
    editCard = () => `${this.BASE_URL}/edit-card`;
    moveCard = () => `${this.BASE_URL}/move-card`;

    get root() {
        return this.BASE_URL;
    }
}

export const cardApiEndpoints = new CardApiEndpoints();
