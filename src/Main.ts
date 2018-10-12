#!/usr/bin/env node
import * as minimist from 'minimist'
import { PZeroPdf } from './PZeroPdf'
import { Logger } from './Logger';

(async () => {
  let args = minimist(process.argv.slice(2), {  
    alias: {
        r: 'researcher',
        d: 'device',
        i: 'issue'
    }
  })

  var researcher = args.r
  var issue      = args.i

  if (!researcher && !issue) {
    Logger.log("Please enter a researcher's name or url to an issue as the argument")
    await process.exit()
  }

  const pzero = PZeroPdf.init()
  if(researcher)  
    await pzero.fetchFor(researcher)
  else if(issue)
    await pzero.fetchIssue(issue)

  await process.exit()
})()