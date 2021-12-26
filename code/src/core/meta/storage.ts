class FileStorage {
    private static appConfig = {
        apiKey: "AIzaSyD_rEq_u2cR8rvQbslFnWKAVMW9GC0NtCY",
        authDomain: "az-db-eac6a.firebaseapp.com",
        databaseURL: "https://az-db-eac6a-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "az-db-eac6a",
        storageBucket: "az-db-eac6a.appspot.com",
        messagingSenderId: "191140497681",
        appId: "1:191140497681:web:4a2ba16ba2858f00ebe4b0"
    };
    // @ts-ignore
    private static app = initializeApp(FileStorage.appConfig);
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
                    FileStorage.fileAccessor[path] = fileEntry
                    return resolve(fileEntry)
                });
            });
        });

    }
}