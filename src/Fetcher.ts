import * as fetch from 'node-fetch'
import { Logger } from './Logger'
import { Browser } from 'puppeteer'
import { createWriteStream } from 'fs'

interface Attachment {
  href: string,
  name: string
}

class Fetcher {
  private _host: string = 'https://bugs.chromium.org/'
  public constructor(private _browser : Browser) {

  }
  name(title): string {
    return title.replace(/[^a-z0-9_-]/gi, '_').replace(/_{2,}/g, '_')
  }

  public async attachment(toBeFetched: Attachment): Promise<void> {
    const url = `${this._host}/p/project-zero/issues/${toBeFetched.href}`
    const response = await fetch.default(url)
    await new Promise((resolve, reject) => {
      const fileStream = createWriteStream(`attachments/${toBeFetched.name}`);
      response.body.pipe(fileStream);
      response.body.on("error", (err) => {
        reject(err);
      });
      fileStream.on("finish", function () {
        resolve();
      });
    })
  }

  async report(url : string) : Promise<void> {

    const page = await this._browser.newPage();

    await page.goto(url, { waitUntil: 'load' });

    const title = await page.evaluate(() => {
      var d = document.getElementsByClassName("vt issueheader")[0]
      const e = d.childNodes[1]
      d.removeChild(e)
      const title = d.getElementsByClassName("h3")[0]
      return title.innerHTML
    });

    const content = await page.evaluate(() => {
      return document.getElementsByClassName("vt issuedescription")[0].innerHTML
    })

    const filename = this.name(title)
    Logger.log(filename)

    const attributes = await page.$x(`//*[@class="attachments"]/table/tbody/tr/td[2]`)

    for (var j = 0; j < attributes.length; j++) {
      const attachments = await page.evaluate((el, filename) => {
        const e = el.getElementsByTagName("a")
        var us = []
        for (var k = 0; k < e.length; k++) {
          var href = e[k].getAttribute("href")
          var name = e[k].getAttribute("download")
          const attachment: Attachment = {
            href,
            name: `${filename}_${name}`
          }
          us.push(attachment)
        }
        return us
      }, attributes[j], filename);

      for (var i = 0; i < attachments.length; i++) {
        await this.attachment(attachments[i])
      }
    }

    await page.setContent(title + content)
    await page.pdf({ path: `issuepdfs/${filename}.pdf`, printBackground: true, displayHeaderFooter: false });

    await page.close()
  }

  async finder(researcher: string = '' ) {
    const page = await this._browser.newPage();

    const url = `${this._host}/p/project-zero/issues/list?can=1&q=finder:${researcher}&colspec=ID+Summary&cells=ids&num=2000&start=1`
    await page.goto(url, { waitUntil: 'load' });
    let tdxpath = `//*[@id="resultstable"]/tbody/tr/td[2]`;

    const tds = await page.$x(tdxpath)
    if (tds.length > 0) {

      for (var i = 0; i < tds.length; i++) {
        const u = await page.evaluate((el) => {
          return el.getElementsByClassName("computehref")[0].getAttribute("href")
        }, tds[i]);

        var reportURL = `${this._host}${u}`

        await this.report(reportURL)
      }
    }
  }
}
export { Fetcher }
