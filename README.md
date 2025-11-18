

# archive-6
This is a game. I am doing my best to make it work. 

## how to update the db scheme
* get it working in AddEntryBit
* Might want it in ShowSingle (Might nuke this though? hmm)
* define things in utils/db.ts
* catagory drop down options in constants.ts



## put assets
projects>assets


## todo
7.0.1
[]  ImportExport UpdateDBVersion() - check that bunblded resource is newer than existing DB and replace, so palytesters get net version. Maybe replace in the log in screen?
[]  Check that media files save and load properly in electron package
[] check that media files save and load properly in web version - if not, just disable that feature for web
[x] get media files - audio, mp4 and pdf working 
[] multiple start state bools - ImportExport NewGame(hexhash)
[] Set default hexhash for game start (in log in with db version ?!)
[x] fix hydration error on ListEditEntry
[] Set default hexhash for new entries (easily changable - probably from importexport? maybe set in gamelogic?)

0.6.*
[x] Populate SingleItem from edit button
[x]  Cross referencing
    - Needs to be able to select and cross reference two entries together (updates both entries on save)
    - When one entry is not hashed, it is displayed as “UNAVAILABLE”
    - use this "entry" object type to trigger from open entry. 
      - Logic -> Open Entry -> Check Game State Conditionals -> If trigger effect, do so -> if trigger entry unlock, wait until next navigation step
[x] bool for "start state" JSON
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

<a href="https://www.flaticon.com/free-icons/code" title="code icons">Code icons created by HideMaru - Flaticon</a>
<br>



## Starting Development

Start the app in the `dev` environment:

```bash
npm run dev:electron
```

## Packaging for Production

To package apps for the local platform:

```bash
cd packages/electron
npm run package
```
