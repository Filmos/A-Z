export default class DataBind {
    path: string;

    constructor(path: string) {
        this.path = path;
    }
    subpath(path: string) {
        return new DataBind(this.path + "." + path);
    }

    get() {
        return this.path;
    }
}