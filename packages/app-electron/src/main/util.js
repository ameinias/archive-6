/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';

export function resolveHtmlPath(htmlFileName) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
     console.log('---- utils.js - url.href  -----------' + url.href);
    return url.href;
  }
  const thing = path.resolve(__dirname, '../renderer/', htmlFileName);
  console.log('---- utils.js ' +  thing);


  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}
