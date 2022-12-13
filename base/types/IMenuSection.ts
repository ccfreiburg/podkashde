import IMenuItemBase from "./IMenuItemBase";

export default interface IMenuSectionBase {
    description: string;
    name: string;
    entries: Array<IMenuItemBase>;
}