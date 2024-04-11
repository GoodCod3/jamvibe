class IndexDBManager {
    private dbName: string = 'jamvibedb';
    private dbVersion: number = 1;
    private db: IDBDatabase | null = null;

    constructor() {
        this.openIndexedDB();
    }

    async openIndexedDB() {
        return new Promise<void>((resolve, reject) => {
            const request = window.indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error('Error opening IndexedDB:', request.error);
                reject(request.error);
            };

            request.onsuccess = (event) => {
                this.db = request.result;
                console.log('IndexedDB opened successfully');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const objectStore = db.createObjectStore('recordings', { autoIncrement: true });
                objectStore.createIndex('blob', 'blob', { unique: false });
                console.log('IndexedDB upgrade complete');
            };
        });
    }

    async addRecording(blob: Blob) {
        if (!this.db) {
            throw new Error('IndexedDB is not initialized');
        }

        return new Promise<void>((resolve, reject) => {
            const transaction = this.db!.transaction('recordings', 'readwrite');
            const objectStore = transaction.objectStore('recordings');
            const request = objectStore.add(blob);

            request.onerror = (event) => {
                console.error('Error adding recording to IndexedDB:', request.error);
                reject(request.error);
            };

            transaction.oncomplete = () => {
                console.log('Recording added to IndexedDB');
                resolve();
            };
        });
    }

    async deleteRecording(id: number) {
        if (!this.db) {
            throw new Error('IndexedDB is not initialized');
        }

        return new Promise<void>((resolve, reject) => {
            const transaction = this.db!.transaction('recordings', 'readwrite');
            const objectStore = transaction.objectStore('recordings');
            const request = objectStore.delete(id);

            request.onerror = (event) => {
                console.error('Error deleting recording from IndexedDB:', request.error);
                reject(request.error);
            };

            transaction.oncomplete = () => {
                console.log('Recording deleted from IndexedDB');
                resolve();
            };
        });
    }

    async getRecordings(): Promise<Blob[]> {
        if (!this.db) {
            throw new Error('IndexedDB is not initialized');
        }

        return new Promise<Blob[]>((resolve, reject) => {
            const transaction = this.db!.transaction('recordings', 'readonly');
            const objectStore = transaction.objectStore('recordings');
            const request = objectStore.getAll();

            request.onerror = (event) => {
                console.error('Error getting recordings from IndexedDB:', request.error);
                reject(request.error);
            };

            request.onsuccess = (event) => {
                console.log('Recordings retrieved from IndexedDB:', request.result);
                resolve(request.result);
            };
        });
    }
}

export default IndexDBManager;
