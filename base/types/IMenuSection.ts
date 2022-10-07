import IPageMenuItem from "./IPageMenuItem";

export default interface IMenuSection {
    id: number;
    description: string;
    name: string;
    entries: Array<IPageMenuItem>;
}