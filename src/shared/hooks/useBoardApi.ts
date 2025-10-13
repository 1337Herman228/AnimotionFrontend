import useAxios from "./lib/useAxios";
import { MoveCardData } from "@/types";

const useBoardApi = () => {
    const axios = useAxios();

    const moveCard = (data: MoveCardData) => {
        return axios.post(`/board/cards/move`, data);
    };

    return { moveCard };
};

export default useBoardApi;
