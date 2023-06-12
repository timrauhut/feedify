import * as fs from 'fs';
import * as path from 'path';
import { load } from 'cheerio';
import { create } from 'xmlbuilder2';

interface Entry {
  title: string;
  url: string;
  summary: string;
  date: string;
  author: string;
}

interface Selectors {
  title: string;
  url: string;
  summary: string;
  date: string;
  author: string;
}

interface Config {
  htmlDirectory: string;
  outputFilePath: string;
  feedURL: string;
  feedTitle: string;
  selectors: Selectors;
}

const getHtmlFiles = (dir: string): string[] => {
  return fs.readdirSync(dir).flatMap((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      return getHtmlFiles(filePath);
    } else if (path.extname(filePath) === '.html') {
      return [fs.readFileSync(filePath, 'utf-8')];
    }
    return [];
  });
};

const parseHtmlFiles = (htmlFiles: string[], selectors: Selectors): Entry[] => {
  const entries: Entry[] = [];
  htmlFiles.forEach((html) => {
    const $ = load(html);
    const title = $(selectors.title).text();
    const url = $(selectors.url).attr('href') || "";
    const summary = $(selectors.summary).text();
    const date = $(selectors.date).text();
    const author = $(selectors.author).text();
    entries.push({ title, url, summary, date, author });
  });
  return entries;
};

const createAtomFeed = (entries: Entry[], feedTitle: string, feedURL: string): string => {
  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const feedUpdated = entries[0]?.date || new Date().toISOString();

  const atomFeed = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('feed', { xmlns: 'http://www.w3.org/2005/Atom' })
    .ele('link', { href: feedURL, rel: 'self', type: 'application/atom+xml'}).up()
    .ele('updated').txt(feedUpdated).up()
    .ele('id').txt(feedURL).up() 
    .ele('title').txt(feedTitle).up();

  entries.forEach(({ title, url, summary, date, author }) => {
    const entry = atomFeed.ele('entry');
    entry
      .ele('title').txt(title).up()
      .ele('link', { href: url }).up()
      .ele('summary').txt(summary).up()
      .ele('updated').txt(date).up()
      .ele('id').txt(url).up()
      .ele('author').ele('name').txt(author).up();
  });

  return atomFeed.end({ prettyPrint: true });
};

const generateFeed = (config: Config): void => {
  try {
    const htmlFiles = getHtmlFiles(config.htmlDirectory);
    const entries = parseHtmlFiles(htmlFiles, config.selectors);
    const atomFeed = createAtomFeed(entries, config.feedTitle, config.feedURL);
    fs.writeFileSync(config.outputFilePath, atomFeed);
  } catch (error) {
    console.error(`Error creating Atom feed: ${error}`);
  }
}

export default generateFeed;
