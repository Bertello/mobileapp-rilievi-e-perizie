import { Component } from '@angular/core';
import { ServizigeneraliService } from '../services/servizigenerali.service';
import { PhotoService } from '../services/photo.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public servizigenerali: ServizigeneraliService, public photoservice:PhotoService) {}


  salvaPerizia(){
    this.servizigenerali.addnewperizia();
  }

  addPhotoToGallery(){
    this.photoservice.addNewToGallery();
  }
}
