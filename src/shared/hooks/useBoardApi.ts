import { MoveCardData } from "@/types";
import { api } from "../api/axiosInstance";

const useBoardApi = () => {
    const moveCard = (data: MoveCardData) => {
        return api.post(`/board/cards/move`, data);
    };

    return { moveCard };
};

export default useBoardApi;
