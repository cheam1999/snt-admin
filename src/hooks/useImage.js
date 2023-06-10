import { useState } from 'react';
import s3Service from "../services/s3Service";

export default function useImage(item = null) {
    const [picture, setPicture] = useState(null);
    const [imgData, setImgData] = useState(null);

    const onChangePicture = async (e) => {
        if (e.target.files[0]) {
            // console.log("picture: ", e.target.files);
            setPicture(e.target.files[0]);
            const reader = new FileReader();
            // reader.addEventListener("load", () => {
                reader.onload = () =>{
                setImgData(reader.result);
                // console.log(imgData)
            };
            // });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const deleteImage = (index) => {
        setPicture(null);
        setImgData(null);
    }

    const getS3Url = async (bucket) => {
        const preSignedURL = await s3Service.fetchPreSignedURL(picture["name"], bucket);
        const uploadedUrl = await s3Service.uploadImage(preSignedURL, picture)

        return uploadedUrl;
    }

    return [
        picture,
        imgData,
        onChangePicture,
        deleteImage,
        setImgData,
        getS3Url
    ];
}