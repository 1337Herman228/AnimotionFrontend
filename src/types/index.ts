export interface IUser {
    id: string;
    name: string;
    email: string;
    image: string;
    password: string;
    provider: unknown;
    providerId: string;
    backendToken: string;
}

export interface IProject {
    id: string;
    name: string;
    ownerId: string;
    memberIds: string[];
    columnOrder: string[];
}

export interface ICard {
    id: string;
    title: string;
    description: string;
    columnId: string;
    projectId: string;
    assigneeId: string;
    createdAt: Date;
    updatedAt: Date;
    priority: ITaskPriority;
}

export interface IColumn {
    id: string;
    title: string;
    projectId: string;
    cardOrder: string[];
}

export interface IBoardColumn {
    cardOrder: string[];
    cards: ICard[];
    id: string;
    title: string;
}

export interface IBoardProject {
    id: string;
    name: string;
    ownerId: string;
    columns: IBoardColumn[];
    members: IUser[];
    columnOrder: string[];
}

export interface MoveCardData {
    cardId: string;
    sourceColumnId: string;
    destinationColumnId: string;
    destinationIndex: number;
}

export interface IMoveCardMessage {
    projectId: string;
    sourceColumn: {
        id: string;
        cardOrder: string[];
    };
    destinationColumn: {
        id: string;
        cardOrder: string[];
    };
    card: ICard;
}

export interface IMoveColumnMessage {
    projectId: string;
    columnOrder: string[];
}

export interface ITaskPriority {
    id: string;
    projectId: string | null;
    value: string;
    label: string;
    color: string;
}

export interface IAddCardMessage {
    projectId: string;
    title: string;
    columnId: string;
    description: string;
    assigneeId: string | null;
    priority: ITaskPriority | null;
}

export interface IDeleteCardMessage {
    projectId: string;
    deletedCardId: string;
    columnId: string;
}
