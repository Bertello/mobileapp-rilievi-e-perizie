import { Component} from '@angular/core';
import { LibraryService } from '../services/library.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage{
  password : string = '';
  username : string = '';
  
  constructor(public libraryservice: LibraryService, private router: Router) { }

  ngOnInit() {
  }

  login(){

  }

  accedi(){
    let request = this.libraryservice.inviaRichiesta('POST', '/api/loginoperatori',
				{
					"username": this.username,
					"password": this.password
				}
			);
			request.catch( (err) => {
				if (err.response.status == 401) {
					// inserire errore
					console.log(err.response.data);
				}
				else {
					this.libraryservice.errore(err);
				}
			});
			request.then((response) => {
        console.log(response.data);
				this.router.navigate(['/home']);
			})
  }
}
