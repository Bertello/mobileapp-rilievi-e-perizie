import { Component} from '@angular/core';
import { LibraryService } from '../services/library.service';
import { Router } from '@angular/router';
import { ServizigeneraliService } from '../services/servizigenerali.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage{
  password : string = '';
  username : string = '';
  
  constructor(public libraryservice: LibraryService, private router: Router, public servizigenerali: ServizigeneraliService) { }

  ngOnInit() {
  }

  login(){

  }

  accedi(){
    let request = this.libraryservice.inviaRichiesta('POST', '/api/loginoperatori',
				{
					"username": this.servizigenerali.username,
					"password": this.servizigenerali.password
				}
			);
			request.catch( (err) => {
				if (err.response.status == 401) {
					// inserire errore
					console.log(err.response.data);
          // inviare messaggio di errore
          alert("Credenziali errate");
				}
				else {
					this.libraryservice.errore(err);
				}
			});
			request.then((response) => {
        		console.log(response.data);
				this.servizigenerali.getcodoperatore();
				this.router.navigate(['/tabs']);
			})
  }
}

