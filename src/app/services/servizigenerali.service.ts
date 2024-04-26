import { Injectable } from '@angular/core';
import { LibraryService } from './library.service';
import { Geolocation, Position } from '@capacitor/geolocation';
import { PhotoService } from './photo.service';


@Injectable({
  providedIn: 'root'
})
export class ServizigeneraliService {
  constructor(public libraryservice:LibraryService) { }

  descrizione:string = "";
  username: string = "";
  password: string = "";
  codoperatore: string = "";
  codperiziaselezionata: string = "";
  periziaselezionata:any;
  perizie: any;
  visualizzadettagli: boolean = false;
  nessunaperizia:boolean = false;
  coordinate:string = "";
  data:string = "";
  ora:string = "";
  
  

  getcodoperatore(){
    let request = this.libraryservice.inviaRichiesta('GET', '/api/getcodoperatore', {"username": this.username});
    request.then((response) => {
      //console.log(response.data);
      this.codoperatore = response.data.codoperatore;
      console.log("codoperatore: " + this.codoperatore);
      this.getperiziebycodoperatore();
    })
    request.catch((err) => {
      this.libraryservice.errore(err);
    })
  }

  getperiziebycodoperatore(){
    let request = this.libraryservice.inviaRichiesta('GET', '/api/getperiziebycodoperatore', {"codoperatore": this.codoperatore});
    request.then((response) => {
      console.log(response.data);
      if(response.data.length == 0){
        this.nessunaperizia = true;
      }
      else{
        this.nessunaperizia = false;
        this.perizie = response.data;
      }
    })
    request.catch((err) => {
      this.libraryservice.errore(err);
    })
  }

  getperiziabycodperizia(){
    let request = this.libraryservice.inviaRichiesta('GET', '/api/periziebyid/' + this.codperiziaselezionata);
    request.then((response) => {
      console.log(response.data);
      this.periziaselezionata = response.data;
    })
    request.catch((err) => {
      this.libraryservice.errore(err);
    })
  }

  async addnewperizia(){
    /*const coordinates = Geolocation.getCurrentPosition();
    console.log(coordinates);
    this.longitudine = coordinates.ZoneAwarePromise.__zone_symbol__value.coords.longitude;*/

    const coordinates: Promise<Position> = Geolocation.getCurrentPosition(); // Assuming this is your promise-returning method
    const position = await coordinates; // Await the promise to resolve
    this.coordinate = position.coords.latitude + ", " + position.coords.longitude;
    // Get the current date and time
    const now = new Date();
    // Format the date and time as needed
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    this.data = `${year}/${month}/${day}`;
    this.ora = `${hours}:${minutes}`;
    console.log(this.coordinate, this.data, this.ora);
  }
}
