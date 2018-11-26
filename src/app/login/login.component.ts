import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {

  }

  login() {
    this.authService.login(this.model.email, this.model.password);
  }
}
