import axios from 'axios'

const endpoint = process.env.REACT_APP_API_ENDPOINT

const fetchPreSignedURL = async (name, bucket) => {

    const current = new Date();
    const datetime = `${current.getSeconds()}-${current.getMinutes()}-${current.getHours()}-${current.getDate()}-${current.getMonth()+1}-${current.getFullYear()}`;

    const url = endpoint + 'presignedUpload?name=' + datetime + '-' + name + '&bucket=' + bucket

    const res = await axios.get(
        url,
        {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
        }
    ).catch(err => {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        throw err
    })

    return res.data['url']
}

const uploadImage = async (url, file) => {

    const resp = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-type': file["type"],
        },
    }).catch(err => {
        console.log(err);
        throw err
    });

    return url.split('?')[0]
}


const s3Service = {
    fetchPreSignedURL,
    uploadImage,
  };
  
export default s3Service; 

