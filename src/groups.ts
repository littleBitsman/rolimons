import req from './request'
import * as cheerio from 'cheerio'

export const url = "https://www.rolimons.com/group/"

export async function getInfo(groupID: number) {
    try {
        const request = await req.request(url + groupID)
        const parsed = cheerio.load(request['data'])

        return {
            owner_id: parseInt(parsed('#page_content_body > div.top_profile_grid.mt-2.mx-0.mx-sm-3.shadow_md_25 > div.top_profile_grid_section_2.d-flex.top_profile_stat_box_owner > div.text-truncate > div.text-truncate > a').attr('href')!.replace('/player/', '')),
            owner: parsed('#page_content_body > div.top_profile_grid.mt-2.mx-0.mx-sm-3.shadow_md_25 > div.top_profile_grid_section_2.d-flex.top_profile_stat_box_owner > div.text-truncate > div.text-truncate > a').text(),
            members: parsed('#page_content_body > div.top_profile_grid.mt-2.mx-0.mx-sm-3.shadow_md_25 > div.top_profile_grid_section_3.d-flex.top_profile_stat_box > div.top_profile_stat_text_container > div.top_profile_stat_data').text(),
            created: parsed('#page_content_body > div.top_profile_grid.mt-2.mx-0.mx-sm-3.shadow_md_25 > div.top_profile_grid_section_4.d-flex.top_profile_stat_box > div.top_profile_stat_text_container > div.top_profile_stat_data').text(),
            tracked_since: parsed('#page_content_body > div.top_profile_grid.mt-2.mx-0.mx-sm-3.shadow_md_25 > div.top_profile_grid_section_7.d-flex.top_profile_stat_box > div.top_profile_stat_text_container > div.top_profile_stat_data').text(),
            past_day_growth: parsed('#page_content_body > div.top_profile_grid.mt-2.mx-0.mx-sm-3.shadow_md_25 > div.top_profile_grid_section_6.d-flex.top_profile_stat_box > div.top_profile_stat_text_container > div.d-flex > div.top_profile_stat_data').text(),
            last_scan: parsed('#page_content_body > div.top_profile_grid.mt-2.mx-0.mx-sm-3.shadow_md_25 > div.top_profile_grid_section_8.d-flex.top_profile_stat_box > div.top_profile_stat_text_container > div.top_profile_stat_data').text()
        }
    } catch (err) {
        console.log(err)
    }
}

export default { getInfo }