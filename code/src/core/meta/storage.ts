class FileStorage {
    private static fileAccessor: { [filename: string]: any } = {}

    static load(path: string) {
        return new Promise(async (resolve) => {
            let fileEntry = await this.prepFile(path)
            fileEntry.file(function (file: any) {
                var reader = new FileReader();
                reader.onloadend = function() {resolve(this.result)};
                reader.readAsText(file);
            });
        });
    }
    static async write(path: string, data: string) {
        let fileEntry = await this.prepFile(path)
        fileEntry.createWriter(function (fileWriter: any) {
            fileWriter.onerror = function (e: any) {
                console.log("Failed file write: " + e.toString());
            };

            let dataObj = new Blob([data], { type: 'text/plain' });
            fileWriter.write(dataObj);
        });
    }

    static prepFile(path: string): any {
        return new Promise((resolve) => {
            if(this.fileAccessor[path]) return resolve(this.fileAccessor[path])

            // @ts-ignore
            window.requestFileSystem(window.PERSISTENT, 0, function (fs) {
                fs.root.getFile(path+".txt", { create: true, exclusive: false }, function (fileEntry: any) {
                    FileStorage.fileAccessor[path] = fileEntry
                    return resolve(fileEntry)
                });
            });
        });

    }
}