import { Component , NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  savedParentNativeURLs = [];
  items;

  constructor(public plt: Platform, public ngZone: NgZone) {

    plt.ready()
      .then(() => {
        this.listRootDir();
      })
  }

  listRootDir = () => {

    const ROOT_DIRECTORY = "file:///";

    (<any> window).resolveLocalFileSystemURL(ROOT_DIRECTORY,
      (fileSystem) => {

        var reader = fileSystem.createReader();
        reader.readEntries(
          (entries) => {
            this.ngZone.run(()=> {
              this.items = entries;
            });
          }, this.handleError);
      }, this.handleError);
  }

  goDown = (item) => {

    let childName = this.items[0].name;
    let childNativeURL = this.items[0].nativeURL;

    const parentNativeURL = childNativeURL.replace(childName, '');

    this.savedParentNativeURLs.push(parentNativeURL);

    var reader = item.createReader();

    reader.readEntries(
      (children) => {
        this.ngZone.run(()=> {
          this.items = children;
        })
      }, this.handleError);
  }

  goUp = () => {

    const parentNativeURL = this.savedParentNativeURLs.pop();

    (<any> window).resolveLocalFileSystemURL(parentNativeURL,
      (fileSystem) => {
        var reader = fileSystem.createReader();
        reader.readEntries(
          (entries) => {
            this.ngZone.run(()=> {
              this.items = entries;
            })
          }, this.handleError);
      }, this.handleError);
  }

  handleError = (error) => {
    console.log('error reading,', error)
  };
}
