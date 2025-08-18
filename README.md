

# archive-5
Based on Electron-react-Boilerplate with Dexie db.  

## how to update the db scheme
* get it working in AddEntryBit
* Might want it in ShowSingle (Might nuke this though? hmm)
* define things in utils/db.ts
* catagory drop down options in constants.ts

## put assets
projects>assets(check this)

## todo
[x] Populate SingleItem from edit button
[]  Cross referencing
    - Needs to be able to select and cross reference two entries together (updates both entries on save)
    - When one entry is not hashed, it is displayed as “UNAVAILABLE”
    - use this "entry" object type to trigger from open entry. 
      - Logic -> Open Entry -> Check Game State Conditionals -> If trigger effect, do so -> if trigger entry unlock, wait until next navigation step
[] bool for "start state" JSON
[] button switch between admin and player mode
[] image database (https://stackblitz.com/edit/dexie-images?file=console.ts)
[x] Make delete item work
[] Need object that can seach for
[] (Wishlist) format JSON new entry
[] Is this importnat? https://dexie.org/docs/StorageManager
[] https://www.fastdev.com/blog/blog/dexie-local-file-storage/
[] search function 
[] Display Media
[] Form upload media
[] Add Child Report to entry
[] Display child report
[] Auth route
[] textbox edit based on auth route
[x] change new item to a form
[] https://stackoverflow.com/questions/33211672/how-to-submit-a-form-using-enter-key-in-react-js
[]https://codepen.io/dfahlander/pen/RqwoaB/ 

## Asset credits
* [Folder Icon](app.isPackaged) 

<img src=".erb/img/erb-banner.svg" width="100%" />
<a href="https://www.flaticon.com/free-icons/bookmark" title="bookmark icons">Bookmark icons created by Freepik - Flaticon</a>

<br>

<p>
  Electron React Boilerplate uses <a href="https://electron.atom.io/">Electron</a>, <a href="https://facebook.github.io/react/">React</a>, <a href="https://github.com/reactjs/react-router">React Router</a>, <a href="https://webpack.js.org/">Webpack</a> and <a href="https://www.npmjs.com/package/react-refresh">React Fast Refresh</a>.
</p>

<br>



## Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```