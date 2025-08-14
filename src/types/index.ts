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
}

export interface IColumn {
    id: string;
    title: string;
    projectId: string;
    cardOrder: string[];
}

export interface IColumnCard {
    cardOrder: string[];
    cards: ICard[];
    id: string;
    title: string;
}

export interface IBoardProject {
    id: string;
    name: string;
    ownerId: string;
    columns: IColumnCard[];
    members: IUser[];
}
