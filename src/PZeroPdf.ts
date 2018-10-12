import { existsSync, mkdirSync } from 'fs'
import * as puppeteer from 'puppeteer'
import { Fetcher } from './Fetcher'

class PZeroPdf {
  private constructor(){}

  public static init() : PZeroPdf {
    const instance = new this()
    instance.ensureDirs()
    return instance
  }

  private ensureDirs() : void {
    if (!existsSync("./attachments")){
      mkdirSync("./attachments");
    }
    if (!existsSync("./issuepdfs")){
      mkdirSync("./issuepdfs");
    }
  }
  public async fetchFor(researcher: string) : Promise<void> {
    const browser = await puppeteer.launch()
    const fetcher = new Fetcher(browser)
    await fetcher.finder(researcher)
    await browser.close()
  }
  public async fetchIssue(issue: string) : Promise<void> {
    const browser = await puppeteer.launch()
    const fetcher = new Fetcher(browser)
    await fetcher.report(issue)
    await browser.close()
  }
}

export { PZeroPdf }
