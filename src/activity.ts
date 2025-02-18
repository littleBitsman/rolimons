import req from './request'

export const url = "https://api.rolimons.com/tradeads/v1/getrecentads"

export const tagMapping = {
    "1": "Demand",
    "2": "Rares",
    "3": "Robux",
    "4": "Any",
    "5": "Upgrade",
    "6": "Downgrade",
    "7": "Rap",
    "8": "Wishlist",
    "9": "Projecteds",
    "10": "Adds"
}

export type Offer = {
    items?: number[],
    robux?: number,
}
export type Request = {
    items?: number[],
    robux?: number,
    tags: string[]
}

export type TranslatedOffer = {
    items?: number[],
    robux?: number,
}
export type TranslatedRequest = {
    items?: number[],
    robux?: number,
    tags: string[]
}

export type TranslatedTrade = {
    id: number,
    postedAt: number,
    userId: number,
    username: string,
    offer: TranslatedOffer,
    request: TranslatedRequest
}

function translate(arr: [number, number, number, string, Offer, Request][]): TranslatedTrade[] {
    return arr.map(array => {
        return {
            id: array[0],
            postedAt: array[1],
            userId: array[2],
            username: array[3],
            offer: {
                items: array[4].items,
                robux: array[4].robux
            },
            request: {
                items: array[5].items,
                robux: array[5].robux,
                tags: array[5].tags.map(tag => tagMapping[tag] || tag)
            }
        }
    })
}

export async function getTradeAds() {
    const response = await req.request(url)
    const tradejson = response?.data.trade_ads
    return translate(tradejson)
}

export default { getTradeAds }