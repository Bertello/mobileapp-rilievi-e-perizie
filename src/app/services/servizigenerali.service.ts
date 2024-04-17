import { Injectable } from '@angular/core';
import { LibraryService } from './library.service';

@Injectable({
  providedIn: 'root'
})
export class ServizigeneraliService {

  constructor(public libraryservice:LibraryService) { }

  username: string = "";
  password: string = "";
  codoperatore: string = "";
  codperiziaselezionata: string = "";
  periziaselezionata:any;
  perizie: any;
  visualizzadettagli: boolean = false;
  nessunaperizia:boolean = false;
  
  

  getcodoperatore(){
    let request = this.libraryservice.inviaRichiesta('GET', '/api/getcodoperatore', {"username": this.username});
    request.then((response) => {
      //console.log(response.data);
      this.codoperatore = response.data.codoperatore;
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

}
