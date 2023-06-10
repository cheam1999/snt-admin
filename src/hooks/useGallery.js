import { useState } from 'react';
import s3Service from "../services/s3Service";

export default function useGallery(items = []) {
    const [gallery, setGallery] = useState([]);
    const [galleryData, setGalleryData] = useState(items);

    const onChangeGallery = async (e) => {

        const arrayFiles = [...e.target.files];

        const files = arrayFiles.map(file => {
            const reader = new FileReader();

            return new Promise(resolve => {
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        const res = await Promise.all(files);

        setGalleryData([...galleryData, ...res]);
        setGallery([...gallery, ...arrayFiles])
    };

    const deleteGalleryImage = (index) => {
        setGalleryData([
            ...galleryData.slice(0, index),
            ...galleryData.slice(index + 1)
        ]);
        if (gallery.length > 0)
            setGallery([
                ...gallery.slice(0, index),
                ...gallery.slice(index + 1)
            ]);
    }

    const getS3Urls = async (bucket) => {

        const files = gallery.map(async picture => {
            const preSignedURL = await s3Service.fetchPreSignedURL(picture["name"], bucket);
            const uploadedUrl = await s3Service.uploadImage(preSignedURL, picture)

            return new Promise(
                resolve => {
                    resolve(uploadedUrl)
                });
        });

        const res = await Promise.all(files);

        return res;
    }

    return [
        gallery,
        galleryData,
        onChangeGallery,
        deleteGalleryImage,
        setGalleryData,
        getS3Urls
    ];
}