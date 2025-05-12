export interface IPersistable {
    save():Promise<void>
    load():Promise<void>
}