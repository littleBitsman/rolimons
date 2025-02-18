import req from './request'
import * as cheerio from 'cheerio'

export const url = "https://api.rolimons.com/items/v2/itemdetails"
export const uaidurl = "https://www.rolimons.com/uaid/"

const Cached = {
    Status: false,
    Data: undefined as (Item[] | undefined)
}

const dict = {
    demand: {
        "-1": "Unassigned",
        "4": "Amazing",
        "3": "High",
        "2": "Normal",
        "1": "Low",
        "0": "Terrible"
    },
    trend: {
        "-1": "Unassigned",
        "3": "Raising",
        "2": "Stable",
        "1": "Unstable",
        "0": "Lowering"
    },
    booleans: {
        "1": true,
        "-1": false
    }
}

export type Item = {
    name: string,
    acronym: string,
    rap: number,
    value: number,
    default_value: number,
    demand: string,
    trend: string,
    projected: boolean,
    hyped: boolean,
    rare: boolean
}

function translate(array: [string, string, number, number, number, number, number, number, number, number, number][]): Item[] {
    return array.map(item => {
        return {
            name: item[0],
            acronym: item[1],
            rap: item[2],
            value: item[3],
            default_value: item[4],
            demand: dict.demand[item[5]],
            trend: dict.trend[item[6]],
            projected: dict.booleans[item[7]],
            hyped: dict.booleans[item[8]],
            rare: dict.booleans[item[9]]
        }
    })
}

export async function getItems() {
    if (!Cached.Status) {
        const items = await req.request(url)
        if (!items) return
        Cached.Data = translate(items['items'])
        Cached.Status = true
    }
    return Cached.Data
}


export function clearCache() {
    Cached.Data = undefined
    Cached.Status = false
}

export async function searchItem(identifier: string | number): Promise<Item | undefined> {
    try {
        const items = await getItems()
        if (!items) return

        if (typeof identifier == 'string') {
            return items.find(i => i.name.toLowerCase() === identifier.toLowerCase() || i.acronym.toLowerCase() === identifier.toLowerCase())
        } else if (typeof identifier == 'number') {
            return items[identifier]
        }
    } catch (err) {
        console.log(err)
    }
}

export async function getUAID(UAID: string, users: number) {
    var data = []
    data['history'] = []
    const response = await req.request(uaidurl + UAID)
    const parsed = cheerio.load(response['data'])
    var count = 1
    data['item_name'] = parsed('#page_content_body > div.container-fluid.mt-2.px-0 > div > div.col-12.col-sm-6.col-md-7.col-lg-8.col-xl-9.bg-primary.px-0.pb-3.pb-sm-0 > div.d-flex.justify-content-around > div:nth-child(1) > div.d-flex.mt-0.mt-md-4 > div.mx-2.mt-2.pt-0.pt-md-1.text-truncate > h5').text()
    data['last_owner'] = parsed('#page_content_body > div.container-fluid.mt-2.px-0 > div > div.col-12.col-sm-6.col-md-7.col-lg-8.col-xl-9.bg-primary.px-0.pb-3.pb-sm-0 > div.d-flex.justify-content-around > div:nth-child(1) > div:nth-child(2) > div.mx-2.mt-2.pt-1 > h5').text()
    data['serial'] = parsed('#page_content_body > div.container-fluid.mt-2.px-0 > div > div.col-12.col-sm-6.col-md-7.col-lg-8.col-xl-9.bg-primary.px-0.pb-3.pb-sm-0 > div.d-flex.justify-content-around > div.mt-0.mt-sm-1.stat_pane_stat_column.d-block.d-sm-none.d-md-block > div.d-flex.mt-0.mt-sm-4 > div.mx-2.mt-2.pt-0.pt-md-1 > h5').text()
    data['owned_since'] = parsed('#page_content_body > div.container-fluid.mt-2.px-0 > div > div.col-12.col-sm-6.col-md-7.col-lg-8.col-xl-9.bg-primary.px-0.pb-3.pb-sm-0 > div.d-flex.justify-content-around > div:nth-child(1) > div:nth-child(3) > div.mx-2.mt-2.pt-1 > h5').text()
    data['created'] = parsed('#page_content_body > div.container-fluid.mt-2.px-0 > div > div.col-12.col-sm-6.col-md-7.col-lg-8.col-xl-9.bg-primary.px-0.pb-3.pb-sm-0 > div.d-flex.justify-content-around > div.mt-0.mt-sm-1.stat_pane_stat_column.d-block.d-sm-none.d-md-block > div:nth-child(2) > div.mx-2.mt-2.pt-1 > h5').text()
    data['uuid_discovered'] = parsed("#page_content_body > div.container-fluid.mt-2.px-0 > div > div.col-12.col-sm-6.col-md-7.col-lg-8.col-xl-9.bg-primary.px-0.pb-3.pb-sm-0 > div.d-flex.justify-content-around > div.mt-0.mt-sm-1.stat_pane_stat_column.d-block.d-sm-none.d-md-block > div:nth-child(3) > div.mx-2.mt-2.pt-1 > h5").text()
    parsed('#page_content_body > div.mx-0.mx-sm-3').each((_, e) => {
        for (var x = 0; x < users; x++) {
            var id
            var name
            var plr = parsed(e).find(`div:nth-child(${count}) > div > div:nth-child(1) > div.mt-2.mb-1.text-center.text-truncate > a`)
            try {
                name = plr.text();
                id = parseInt(plr.attr('href')!.replace('/player/', ''))
            } catch (e) {
                name = "Hidden/Deleted";
                id = undefined
            }
            var updated_since = parsed(e).find(`div:nth-child(${count}) > div > div.mt-4.pt-2 > h5`).text()
            var updated_date = parsed(e).find(`div:nth-child(${count}) > div > div.mt-4.pt-2 > p.mb-0.text-center.small.text-muted`).text()
            data['history'].push({
                id,
                name,
                updated_since,
                updated_date
            })
            count = count + 1
        }
    })
    return data
}

export default { getItems, searchItem, clearCache, getUAID }
