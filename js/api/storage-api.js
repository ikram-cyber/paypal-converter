import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
import { app } from './firebase.js'; // Pastikan di firebase.js ada `export const app = initializeApp(...)`

export const storage = getStorage();

export const StorageAPI = {
    async uploadImage(file, path = "transmissions") {
        if (!file) return null;
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${path}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const storageRef = ref(storage, fileName);
        
        // Kita pakai uploadBytesResumable biar nanti bisa dibikin loading bar
        const uploadTask = await uploadBytesResumable(storageRef, file);
        const downloadURL = await getDownloadURL(uploadTask.ref);
        
        return downloadURL;
    }
};
