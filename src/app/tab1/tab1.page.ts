import { Component } from '@angular/core';
import { ServizigeneraliService } from '../services/servizigenerali.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(public servizigenerali:ServizigeneraliService) {}

  ionViewDidEnter() {
    // Carica i dati e aggiorna l'interfaccia utente
    this.servizigenerali.visualizzadettagli = false;
    this.servizigenerali.getcodoperatore();
  }

  visualizzaDettagli(codperizia:string){
    this.servizigenerali.codperiziaselezionata = codperizia;
    this.servizigenerali.visualizzadettagli = true;
    this.servizigenerali.getperiziabycodperizia();
  }

  chiudiDettagli(){
    this.servizigenerali.visualizzadettagli = false;
  }
}
