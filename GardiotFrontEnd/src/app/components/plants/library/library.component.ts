import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { PlantService } from "../../../services/plant.service";
import { UserService } from '../../../services/user.service';
import { Plant } from "../../../classes/plant.class";
import { Family } from "../../../classes/family.class";
import { AppComponent } from "../../../app.component";
import { RouterLink,ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
})
export class LibraryComponent implements OnInit {

  private plants:any[]=[];
  private numeroItems:number;
  private paginaActual:number=1;
  private elementosPorPagina:number=2;

  constructor(
    private _plantService:PlantService,
    private _route:Router,
    private _appComponent:AppComponent,
    private activatedRoute: ActivatedRoute,
    private user:UserService
  ) {}

  mostrar(){
    this._plantService.detailsAll(this.paginaActual,this.elementosPorPagina)
        .subscribe(data=>{
          for(let key$ in data){
            this.plants.push(data[key$]);
          }
        },
      error => {
        console.error(error);
      });
  }
  searchcontent(){
    this._plantService.searchAll()
    .subscribe(data=>{
      for(let key$ in data){
        this.plants.push(data[key$]);
      }
    },
    error => {
      console.error(error);
    });
  }

  getitems(){
    this._plantService.getNumberItems()
    .subscribe(data=>{
      this.numeroItems=data[0].NUMPLANTAS;
    },
    error => {
      console.error(error);
    });
  }

  ActualizarPagina(){
    this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.paginaActual = params['pag'];
      });
 }

 comprobaciones(){
   if(this.user.isUserAuthenticated()){
     this.user.isAuthenticated=this.user.isUserAuthenticated();
     this.user.isUserAdmin().subscribe(data=>{
       if(data){
         this.user.isAdmin=true;
       }
       else{
         this.user.isAdmin=false;
       }
     },error=>{
       this.user.isAdmin=false;
     });
   }
   else{
     this.user.isAdmin=false;
   }
 }

  ngOnInit() {
    this.ActualizarPagina();
    this.mostrar();
    this.getitems();
  }

}
