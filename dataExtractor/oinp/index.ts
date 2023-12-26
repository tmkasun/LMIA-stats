import * as cheerio from 'cheerio';
import axios from 'axios';
import logger from '../utils/logger';
import puppeteer from 'puppeteer';
const pUpdates2023 = "https://www.ontario.ca/page/2023-ontario-immigrant-nominee-program-updates";
const noi = "https://www.ontario.ca/page/oinp-express-entry-notifications-interest";

const cheerioz = (async () => {
    logger.info("Start scrapping OINP");
    const res = await fetch(pUpdates2023, {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "cross-site",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": "SESSb35fa96684db862f4d06956465607b10=X8jcG611DpuseRNp79CRxAMsTvLO31Kfti2D1YbZ-jM",
            "Referer": "https://www.google.com/",
            "Referrer-Policy": "origin",
            "User-Agent": 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41'
        },
        "body": null,
        "method": "GET"
    });
    const response = await res.text();
    logger.info(response)
    // const response = await axios('https://www.ontario.ca/page/oinp-express-entry-notifications-interest');
    // if (response.status !== 200) {
    //     logger.error("Can't fetch the page");
    //     return
    // }
    const $ = await cheerio.load(response);
    debugger
})

const pup = async () => {
    const draws = new Set();
    const browser = await puppeteer.launch({ headless: true });

    // Open a new tab
    const page = await browser.newPage();


    // Visit the page and wait until network connections are completed
    await page.goto(pUpdates2023, { waitUntil: 'networkidle2' });
    const element = await page.$$('h3');
    await Promise.all(element?.map(async (foo) => {
        const value = await foo.evaluate(el => el.textContent);
        const prev = await page.evaluateHandle(el => el.previousElementSibling, foo);
        const next = await page.evaluateHandle(el => el.nextElementSibling, foo);
        // const value2 = await prev.evaluate(el => el.textContent);
        // const fff = await (await prev.getProperty('innerHTML')).jsonValue()
        const xxx = await (await next.getProperty('innerHTML')).jsonValue()
        debugger
        draws.add(value);
    }))
    const sortedDraws = Array.from(draws).map((draw, i) => {
        logger.info(`i = ${i} => ${draw}`)
        return new Date(draw as string)
    }).sort((a: any, b: any) => b - a);
    let i =0;
    for (let draw of sortedDraws) {
        logger.info(`i = ${i} ${draw}`);
        i++
    }
    debugger
}

pup()