/*
Copyright 2020 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as matrixcs from "matrix-js-sdk/lib/matrix";
import AsyncStorage from "@react-native-community/async-storage";

import AsyncCryptoStore from "./AsyncCryptoStore";

import setGlobalVars from 'indexeddbshim/dist/indexeddbshim-noninvasive';

/**
 * Make IndexedDB available via shimming
 * @param {WindowDatabase} backend - The database backend to use, e.g. as imported from react-native-sqlite-2
 */
export function shimIndexedDB(backend: WindowDatabase) {
    setGlobalVars(window, { checkOrigin: false, win: backend });
}

matrixcs.setCryptoStoreFactory(() => {
    if (window.indexedDB) {
        console.log("Found IndexedDB. Creating IndexedDBCryptoStore.")
        return new matrixcs.IndexedDBCryptoStore(window.indexedDB, "crypto");
    }
    console.warn("IndexedDB not available. Falling back to built-in crypto store.")
    return new AsyncCryptoStore(AsyncStorage);
});

export * from "matrix-js-sdk/lib/matrix";
export default matrixcs;
