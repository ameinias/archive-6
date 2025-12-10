import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
  MenuItem
} from 'electron';
import { saveDefaultDatabase } from './main';

export default class MenuBuilder {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    } else {
      this.setupProductionEnvironment();
    }

    // Create a simple menu template
    const fakeTemplate = [
      {
        label: '&File',
        submenu: [
          {
          label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },

    ];

    const fakeMenu = Menu.buildFromTemplate(fakeTemplate);
     Menu.setApplicationMenu(fakeMenu);   // APP MENUU TODO

    return fakeMenu;
  }

  // This is where to control the right click menu for development.
  setupDevelopmentEnvironment() {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
       const { x, y, misspelledWord, dictionarySuggestions } = props;



    const menuTemplate = [];

    // Add spelling suggestions if word is misspelled
    if (misspelledWord) {
      for (const suggestion of dictionarySuggestions.slice(0, 5)) {
        menuTemplate.push({
          label: suggestion,
          click: () => this.mainWindow.webContents.replaceMisspelling(suggestion)
        });
      }

      // Add separator
      menuTemplate.push({ type: 'separator' });

      // Add to dictionary option
      menuTemplate.push({
        label: 'Add to dictionary',
        click: () => this.mainWindow.webContents.session.addWordToSpellCheckerDictionary(misspelledWord)
      });

      menuTemplate.push({ type: 'separator' });
    }

    // Add your existing menu items
    menuTemplate.push(

        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },

        {
          label: 'Resize Window to Default',

          click: () => {
            this.mainWindow.setSize(755, 655);
            this.mainWindow.center();
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          accelerator: 'Ctrl+X',
          role: 'cut',
        },
        {
          label: 'Copy',
          accelerator: 'Ctrl+C',
          role: 'copy',
        },
        {
          label: 'Paste',
          accelerator: 'Ctrl+V',
          role: 'paste',
        },
        {
          label: 'Select All',
          accelerator: 'Ctrl+A',
          role: 'selectAll',
        },
        {
          label: 'Edit',
          submenu: [
            {
              label: 'Toggle Admin',
              click: () => {
                // Execute in renderer context
                this.mainWindow.webContents.executeJavaScript(`
      const currentAdmin = localStorage.getItem('isAdmin') === 'true';
      const newAdmin = !currentAdmin;
      localStorage.setItem('isAdmin', newAdmin.toString());
      window.location.reload(); // Force React to re-read the value
    `);
              },
            },
            {
              label: 'Undo',
              accelerator: 'Command+Z',
              selector: 'undo:',
            },
            {
              label: 'Redo',
              accelerator: 'Shift+Command+Z',
              selector: 'redo:',
            },
            {
              type: 'separator',
            },
            {
              label: 'Cut',
              accelerator: 'Command+X',
              selector: 'cut:',
            },
            {
              label: 'Copy',
              accelerator: 'Command+C',
              selector: 'copy:',
            },
            {
              label: 'Paste',
              accelerator: 'Command+V',
              selector: 'paste:',
            },
            {
              label: 'Select All',
              accelerator: 'Command+A',
              selector: 'selectAll:',
            },
          ],
        },


    );


      Menu.buildFromTemplate(menuTemplate).popup({
        window: this.mainWindow,
      });
    });
  }

  // This is where to control the right click menu for development.
  setupProductionEnvironment() {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
        {
          label: 'Excuse me, what are you doing?',
        },

        {
          label: 'Resize Window to Default',

          click: () => {
            this.mainWindow.setSize(755, 655);
            this.mainWindow.center();
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          accelerator: 'Command+X',
          selector: 'cut:',
        },
        {
          label: 'Copy',
          accelerator: 'Command+C',
          selector: 'copy:',
        },
        {
          label: 'Paste',
          accelerator: 'Command+V',
          selector: 'paste:',
        },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
        {
          label: 'Edit',
          submenu: [
            {
              label: 'Toggle Admin',
              click: () => {
                // Execute in renderer context
                this.mainWindow.webContents.executeJavaScript(`
      const currentAdmin = localStorage.getItem('isAdmin') === 'true';
      const newAdmin = !currentAdmin;
      localStorage.setItem('isAdmin', newAdmin.toString());
      window.location.reload(); // Force React to re-read the value
    `);
              },
            },
            {
              label: 'Undo',
              accelerator: 'Command+Z',
              selector: 'undo:',
            },
            {
              label: 'Redo',
              accelerator: 'Shift+Command+Z',
              selector: 'redo:',
            },
            {
              type: 'separator',
            },
            {
              label: 'Cut',
              accelerator: 'Command+X',
              selector: 'cut:',
            },
            {
              label: 'Copy',
              accelerator: 'Command+C',
              selector: 'copy:',
            },
            {
              label: 'Paste',
              accelerator: 'Command+V',
              selector: 'paste:',
            },
            {
              label: 'Select All',
              accelerator: 'Command+A',
              selector: 'selectAll:',
            },
          ],
        },
      ]).popup({
        window: this.mainWindow,
      });
    });
  }

  buildDarwinTemplate() {
    const subMenuAbout = {
      label: 'Electron',
      submenu: [
        {
          label: 'About ElectronReact',
          selector: 'orderFrontStandardAboutPanel:',
        },
        {
          type: 'separator',
        },
        {
          label: 'Services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          label: 'Hide ElectronReact',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        {
          label: 'Show All',
          selector: 'unhideAllApplications:',
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuEdit = {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Command+Z',
          selector: 'undo:',
        },
        {
          label: 'Redo',
          accelerator: 'Shift+Command+Z',
          selector: 'redo:',
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          accelerator: 'Command+X',
          selector: 'cut:',
        },
        {
          label: 'Copy',
          accelerator: 'Command+C',
          selector: 'copy:',
        },
        {
          label: 'Paste',
          accelerator: 'Command+V',
          selector: 'paste:',
        },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuViewDev = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        {
          label: 'Close',
          accelerator: 'Command+W',
          selector: 'performClose:',
        },
        {
          type: 'separator',
        },
        {
          label: 'Bring All to Front',
          selector: 'arrangeInFront:',
        },
      ],
    };
    const subMenuHelp = {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('https://electronjs.org');
          },
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal(
              'https://github.com/electron/electron/tree/main/docs#readme',
            );
          },
        },
        {
          label: 'Community Discussions',
          click() {
            shell.openExternal('https://www.electronjs.org/community');
          },
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    // const templateDefault = [{
    //     label: '&File',
    //     submenu: [{
    //         label: '&Open',
    //         accelerator: 'Ctrl+O',
    //       },
    //       {
    //         label: '&Close',
    //         accelerator: 'Ctrl+W',
    //         click: () => {
    //           this.mainWindow.close();
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     label: '&View',
    //     submenu: process.env.NODE_ENV === 'development' ||
    //       process.env.DEBUG_PROD === 'true' ?
    //       [{
    //           label: '&Reload',
    //           accelerator: 'Ctrl+R',
    //           click: () => {
    //             this.mainWindow.webContents.reload();
    //           },
    //         },
    //         {
    //           label: 'Toggle &Full Screen',
    //           accelerator: 'F11',
    //           click: () => {
    //             this.mainWindow.setFullScreen(
    //               !this.mainWindow.isFullScreen(),
    //             );
    //           },
    //         },
    //         {
    //           label: 'Toggle &Developer Tools',
    //           accelerator: 'Alt+Ctrl+I',
    //           click: () => {
    //             this.mainWindow.webContents.toggleDevTools();
    //           },
    //         },
    //       ] :
    //       [{
    //         label: 'Toggle &Full Screen',
    //         accelerator: 'F11',
    //         click: () => {
    //           this.mainWindow.setFullScreen(
    //             !this.mainWindow.isFullScreen(),
    //           );
    //         },
    //       }, ],
    //   },
    //   {
    //     label: 'Help',
    //     submenu: [{
    //         label: 'Learn More',
    //         click() {
    //           shell.openExternal('https://electronjs.org');
    //         },
    //       },
    //       {
    //         label: 'Documentation',
    //         click() {
    //           shell.openExternal(
    //             'https://github.com/electron/electron/tree/main/docs#readme',
    //           );
    //         },
    //       },
    //       {
    //         label: 'Community Discussions',
    //         click() {
    //           shell.openExternal('https://www.electronjs.org/community');
    //         },
    //       },
    //       {
    //         label: 'Search Issues',
    //         click() {
    //           shell.openExternal('https://github.com/electron/electron/issues');
    //         },
    //       },
    //     ],
    //   },
    // ];

    const fakeTemplate = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
    ];

    return [templateDefault, fakeTemplate];
  }
}
