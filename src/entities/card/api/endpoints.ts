class CardApiEndpoints {
    private readonly BASE_URL = "/app/board";

    addCard = () => `${this.BASE_URL}/add-card`;
    deleteCard = () => `${this.BASE_URL}/delete-card`;
    editCard = () => `${this.BASE_URL}/edit-card`;
    moveCard = () => `${this.BASE_URL}/move-card`;

    get root() {
        return this.BASE_URL;
    }
}

export const cardApiEndpoints = new CardApiEndpoints();
