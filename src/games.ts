import req from './request'
import * as cheerio from 'cheerio'

export const url = "https://www.rolimons.com/game/"

export type GameInfo = {
    name: string
    creator_name: string
    created: string
    max_players: string
    genre: string
    players: string
    vists: string
    likes: string
    dislikes: string
    description: string
    like_percentage: string
    favorites: string
    average_playtime: string
    last_updated: string
}

export async function getInfo(gameID: number): Promise<GameInfo | undefined> {
    try {
        const request = await req.request(url + gameID)
        const parsed = cheerio.load(request['data'])

        return {
            name: parsed('#page_content_body > div.mt-3.mx-3.d-flex.justify-content-between.flex-wrap > h1').text(),
            creator_name: parsed('a.stat-data').text(),
            created: parsed("#page_content_body > div.container-fluid.mt-2.px-0 > div > div.col-12.col-lg-4.col-xl-4.px-0 > div > div > div.d-flex.justify-content-around.justify-content-lg-start.pt-3.pb-4.px-5.px-sm-4.flex-wrap > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div.stat-data").text(),
            max_players: parsed("#page_content_body > div.container-fluid.mt-2.px-0 > div > div.col-12.col-lg-4.col-xl-4.px-0 > div > div > div.d-flex.justify-content-around.justify-content-lg-start.pt-3.pb-4.px-5.px-sm-4.flex-wrap > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div.stat-data").text(),
            genre: parsed("#page_content_body > div.container-fluid.mt-2.px-0 > div > div.col-12.col-lg-4.col-xl-4.px-0 > div > div > div.d-flex.justify-content-around.justify-content-lg-start.pt-3.pb-4.px-5.px-sm-4.flex-wrap > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div.stat-data").text(),
            players: parsed('#page_content_body > div.game_stats_grid.mx-sm-3.mt-3 > div:nth-child(1) > div:nth-child(2) > div.game_stat_data').text(),
            vists: parsed('#page_content_body > div.game_stats_grid.mx-sm-3.mt-3 > div:nth-child(2) > div:nth-child(2) > div.game_stat_data').text(),
            likes: parsed('#page_content_body > div.game_stats_grid.mx-sm-3.mt-3 > div:nth-child(3) > div:nth-child(2) > div.game_stat_data').text(),
            dislikes: parsed('#page_content_body > div.game_stats_grid.mx-sm-3.mt-3 > div:nth-child(4) > div:nth-child(2) > div.game_stat_data').text(),
            description: parsed("#page_content_body > div:nth-child(7) > div > div > pre").text(),
            like_percentage: parsed('#page_content_body > div.game_stats_grid.mx-sm-3.mt-3 > div:nth-child(5) > div:nth-child(2) > div.game_stat_data').text(),
            favorites: parsed('#page_content_body > div.game_stats_grid.mx-sm-3.mt-3 > div:nth-child(6) > div:nth-child(2) > div.game_stat_data').text(),
            average_playtime: parsed('#page_content_body > div.game_stats_grid.mx-sm-3.mt-3 > div:nth-child(7) > div:nth-child(2) > div.game_stat_data').text(),
            last_updated: parsed('#page_content_body > div.game_stats_grid.mx-sm-3.mt-3 > div:nth-child(8) > div:nth-child(2) > div.game_stat_data').text()
        }
    } catch (err) {
        console.log(err)
    }
}

export default { getInfo }