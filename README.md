

# archive-6
This is a game. I am doing my best to make it work. 

## how to update the db scheme
* Form input or programmed content in AddEntryFunc, AddSubEntryFunc
* Display for players in StaticSingle-Default, StaticSub, any of the lists
* define things in utils/db.ts - update schema version
* catagory drop down options in constants.ts if needed

## surpress annoying logs
-[vite] in web version
-[HMR] -[webpack-dev-server]  in electron console


## put assets
projects>assets


## todo
### 7.0.4 - 8/12/2025
Missed a few version numbers here?
[x] Big clean up to make writing subentries way faster - again. Obsessed with my own writing workflow
[x] Edit list on homepage can now filter by vignette - ssd5f9b259a21092a89659aa16a9913737 to unlock
[x] filter list now mentions triggers
[x] Have a single trigger working. For now it just adds a button to the navbar.
[x] Save button on entries now blinks the page so you can more easily tell that save works
[x] option to save telemtrics on log-out - just saves a copy of the gamesave-state, but that includes times that entries were unlocked and their username
[x] endscreen with an terminal animation like they're talking to you



#### Abandoned/Future features
[-] Media item gets "stuck", brining attachment from last entry. 
[ ] After next installation - make a page so you can load a telemetrics document and display the order items were unlocked. 
[ ] MouseControl
[ ] use https://magicui.design/docs/components/animated-list for entity conversation
[ ] Use that motion plug-in to make the entity entries appear one-by-one
- [ ] Make the timestamps be the real-time they showed up. 
- [ ] Make the "final entry" be a re-direct to a static page so I can do more stuff with in. 
[ ] Button on edit subentries that sets their hash and date to match their parent.


### 7.0.1
[x] Big clean up to make writing subentries way faster
[x] Use [link parser](https://github.com/amir2mi/react-link-parser) with DescriptionEntry to parse links in subentry descriptions to other entries using ##entryID 
[x] finish ReTitleSubentrys - now sorts by date and renumbers
[]  ImportExport UpdateDBVersion() - check that bunblded resource is newer than existing DB and replace, so palytesters get net version. Maybe replace in the log in screen?
[x]  Check that media files save and load properly in electron package
[] check that media files save and load properly in web version - if not, just disable that feature for web
[x] get media files - audio, mp4 and pdf working 
[x] multiple start state bools - ImportExport NewGame(hexhash)
[x] Set default hexhash for game start (in log in with db version ?!)
[x] fix hydration error on ListEditEntry


#### Abandoned features 
[-] Set default hexhash for new entries (easily changable - probably from importexport? maybe set in gamelogic?) 
[-] Save and load entries from template

### 0.6.*
[x] Populate SingleItem from edit button
[x]  Cross referencing
    - Needs to be able to select and cross reference two entries together (updates both entries on save)
    - When one entry is not hashed, it is displayed as “UNAVAILABLE”
    - use this "entry" object type to trigger from open entry. 
      - Logic -> Open Entry -> Check Game State Conditionals -> If trigger effect, do so -> if trigger entry unlock, wait until next navigation step
[x] bool for "start state" JSON
[x] button switch between admin and player mode
[?] image database (https://stackblitz.com/edit/dexie-images?file=console.ts)
[x] Make delete item work
[x] Need object that can seach for
[-] (Wishlist) format JSON new entry
[-] Is this importnat? https://dexie.org/docs/StorageManager
[-] https://www.fastdev.com/blog/blog/dexie-local-file-storage/
[x] search function 
[x] Display Media
[x] Form upload media
[x] Add Child Report to entry
[x] Display child report
[x] Auth route
[x] textbox edit based on auth route
[x] change new item to a form
[] https://stackoverflow.com/questions/33211672/how-to-submit-a-form-using-enter-key-in-react-js
[]https://codepen.io/dfahlander/pen/RqwoaB/ 

## Asset credits
* [Folder Icon](app.isPackaged) 

<img src=".erb/img/erb-banner.svg" width="100%" />
<a href="https://www.flaticon.com/free-icons/bookmark" title="bookmark icons">Bookmark icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/speaker" title="speaker icons">Speaker icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/document" title="document icons">Document icons created by Freepik - Flaticon</a>

<a href="https://www.flaticon.com/free-icon/film_1146203?term=video&page=1&position=27&origin=search&related_id=1146203" title="document icons">Video icons created by Freepik - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/code" title="code icons">Code icons created by HideMaru - Flaticon</a>
<br>
<a href="https://www.flaticon.com/free-icons/close" title="close icons">Close icons created by Bankume - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/hide" title="hide icons">Hide icons created by gravisio - Flaticon</a>

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
