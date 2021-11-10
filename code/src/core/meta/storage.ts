class FileStorage {
    private static fileAccessor: { [filename: string]: any } = {}

    static load(path: string) {
        return new Promise(async (resolve) => {
            resolve(JSON.parse("" + window.localStorage.getItem(path)))
        });
    }
    static async write(path: string, data: any) {
        data = JSON.stringify(data)
        return new Promise<void>(async (resolve) => {
            window.localStorage.setItem(path, data)
            resolve()
        });
    }

    static prepFile(path: string): any {
        return new Promise((resolve) => {
            if(this.fileAccessor[path]) return resolve(this.fileAccessor[path])

            // @ts-ignore
            window.requestFileSystem(window.PERSISTENT, 0, function (fs) {
                fs.root.getFile(path+".txt", { create: true, exclusive: false }, function (fileEntry: any) {
                    alert("<-->")
                    FileStorage.fileAccessor[path] = fileEntry
                    return resolve(fileEntry)
                }, alert);
            });
        });

    }
}