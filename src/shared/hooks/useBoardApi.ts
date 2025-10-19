import { MoveCardData } from "@/types";
import { useAxios } from "../api";

const useBoardApi = () => {
  const axios = useAxios();

  const moveCard = (data: MoveCardData) => {
    return axios.post(`/board/cards/move`, data);
  };

  return { moveCard };
};

export default useBoardApi;
