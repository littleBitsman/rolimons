import axios from 'axios'

export async function request(url: string, headers: object = {}) {
    return await axios.get(url, { headers }) 
        .catch(error => console.error(error))
}

export default { request }