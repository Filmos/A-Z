import { onValue } from "@firebase/database";
import { child } from "firebase/database";
import db from '@/core/database';
import { Ref, ref } from "vue";

export default class DataBind {
    path: string;
    bindHook?: Ref;

    constructor(path: string) {
        this.path = path;
    }
    iterate() {
        if(!this.bindHook) (async()=>{
            this.bindHook = ref(()=>[])
            onValue(child(await db, `${this.path}/`), (snapshot) => {
                this.bindHook!.value = Object.keys(snapshot.val()).map((key) => new DataBind(`${this.path}/${key}`));
            });
        })()
        return this.bindHook!.value
    }

    getPath() {
        return this.path;
    }
}