import req from './request'
import * as cheerio from 'cheerio'

export const url = "https://api.rolimons.com/players/v1/playerinfo/"
export const leaderboard = "https://rolimons.com/leaderboard/"

export type Player = {
    name: string,
    value: number,
    rap: number,
    rank?: number,
    premium: boolean,   
    privacy_enabled: boolean,
    terminated: boolean,
    stats_updated: number,
    last_scan: number,
    last_online: number,
    last_location: 'Website' | 'Studio' | 'Game' | 'Offline',
    rolibadges: {
        [key: string]: number
    }
}

export async function getPlayer(id: string | number): Promise<Player> {
    return (await req.request(url + id.toString()))['data']
}

export async function getLeaderboard(page): Promise<{ id: number, name: string, rank: number, value: number, rap: number }[] | undefined> 
{
    if (!page || page > 20) {
        return undefined
    }

    var count = 1
    const request = await req.request(leaderboard + page)
    const parsed = cheerio.load(request['data'])
    return parsed('#page_content_body > div.d-flex.justify-content-between.flex-wrap.px-3.mt-3').toArray().map(e => {
        const inArr: object[] = []
        for (var _ = 0; _ < 50; _++) {
            inArr.push({
                id: parseInt(parsed(e).find(`div:nth-child(${count}) > a`).attr('href')!.replace("/player/", '')),
                name: parsed(e).find(`div:nth-child(${count}) > a > div:nth-child(1) > h6`).text(),
                rank: parsed(e).find(`div:nth-child(${count}) > a > div.px-2.pt-1 > div:nth-child(1) > div:nth-child(2) > span`).text(),
                value: parsed(e).find(`div:nth-child(${count}) > a > div.px-2.pt-1 > div:nth-child(2) > div:nth-child(2) > span`).text(),
                rap: parsed(e).find(`div:nth-child(${count}) > a > div.px-2.pt-1 > div:nth-child(3) > div:nth-child(2) > span`).text()
            })
        }
        return inArr
    }).flat(Infinity) as any // Funny thing to make TS not yell at you
}

export default { getPlayer, getLeaderboard }
