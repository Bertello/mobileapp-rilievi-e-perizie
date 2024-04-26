import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { LibraryService } from './library.service';
import { Geolocation, Position } from '@capacitor/geolocation';
import { ServizigeneraliService } from './servizigenerali.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public codoperatore:string = "";
  public immagini: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';
  private platform: Platform;
  public coordinate:any={}
  public base64img:any[] = [];
  public descrizione:string ="";
  public commenti:any[] = [""];


  constructor(platform: Platform, public libraryService : LibraryService, public servizigenerali: ServizigeneraliService) {
    this.platform = platform;
  }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    //Add the image at beginning of the array
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.immagini.push(savedImageFile);
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.immagini),
    });
  }

  private async savePicture(photo: Photo) { 
    const base64Data = await this.readAsBase64(photo);
    this.base64img.push(base64Data);
    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    if (this.platform.is('hybrid')) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {
      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };
    }
  }

  private async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!
      });
      return file.data;
    }
    else{
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
  
      return await this.convertBlobToBase64(blob) as string;
    }
    
  }
  
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  eliminafoto(foto:any){
    let i = this.immagini.indexOf(foto);
    if (i > -1) {
      this.immagini.splice(i, 1);
      this.immagini.splice(i, 1);
      this.commenti.splice(i, 1);
    }
  }

  async salvaPerizia(){
    const coordinates: Promise<Position> = Geolocation.getCurrentPosition(); // Assuming this is your promise-returning method
    let img:any = {};
    let dettagli :any = {};
    const posizione = await coordinates; // Await the promise to resolve
    let coordinate = posizione.coords.latitude + ", " + posizione.coords.longitude;
    // Get the current date and time
    const now = new Date();
    // Format the date and time as needed
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    let date = `${day}/${month}/${year}`;
    let ora = `${hours}:${minutes}`;

    let numperizie = (await this.libraryService.inviaRichiesta('GET', '/api/getnumeroperizie').catch((err : any) => { this.libraryService.errore(err); }) as any).data.num;
    console.log("numero perizie: " + numperizie);

    let isPerizia = false;
    let codperizia = 0;
    for(let i = 1; i <= numperizie; i++)
    {
      let data: any;
      data = await this.libraryService.inviaRichiesta('GET', '/api/periziebyid/' + i).catch((err : any) => { this.libraryService.errore(err); });
      // prendere i dati da data
      console.log(!data.data);
      if(!data.data)
      {
        isPerizia = true;
        console.log("isPerizia: " + isPerizia);
        codperizia = i;
        break;
      }
    }
    if(isPerizia == false)
      codperizia = numperizie + 1;

    await this.libraryService.inviaRichiesta('POST', '/api/aggiungiperizia',{"codperizia":codperizia, "codoperatore":parseInt(this.servizigenerali.codoperatore) ,"coordinate": coordinate,"dataperizia": date,"oraperizia": ora, "descrizione": this.descrizione})
    .catch((err : any) => { this.libraryService.errore(err); });
    for(let i=0; i<this.base64img.length; i++)
    {
      img = {"img":this.base64img[i], "commento":this.commenti[i]};
      console.log(codperizia, dettagli);
      await this.libraryService.inviaRichiesta('POST', '/api/salvaPeriziaOnCloudinary', {img,codperizia}).catch((err : any) => { this.libraryService.errore(err); });
    }
    this.commenti = [""];
    this.descrizione = "";
    this.base64img = [];
    this.immagini = [];
    
  }
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}
