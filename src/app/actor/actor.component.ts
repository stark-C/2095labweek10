import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../database.service";

@Component({
  selector: "app-actor",
  templateUrl: "./actor.component.html",
  styleUrls: ["./actor.component.css"],
})
export class ActorComponent implements OnInit {
  actorsDB: any[] = [];

  moviesDB: any[] = [];

  bfYear: number = 0;

  section = 1;

  fullName: string = "";
  bYear: number = 0;
  actorId: string = "";

  movieName: string = "";
  year: number = 0;
  movieId: string = "";
  expandedList: any[] = [];
  added = "";

  constructor(private dbService: DatabaseService) {}

  //Get all Actors
  onGetActors() {
    this.dbService.getActors().subscribe((data: any[]) => {
      this.actorsDB = data;
    });
  }
  //Create a new Actor, POST request
  onSaveActor() {
    let obj = { name: this.fullName, bYear: this.bYear };
    this.dbService.createActor(obj).subscribe(result => {
      this.onGetActors();
    });
  }

  onGetMovies(){
    this.dbService.getMovies().subscribe((data:any[]) => {
      this.moviesDB = data;
    })
  }
  expand(actorList, movieName){
    this.expandedList = actorList;
    this.movieName = movieName;
  }

  onSaveMovie(){
    let obj = {title: this.movieName, year: this.year};
    this.dbService.createMovie(obj).subscribe(result => {
      this.onGetMovies();
    })
  }
  // Update an Actor
  onSelectUpdate(item) {
    this.fullName = item.name;
    this.bYear = item.bYear;
    this.actorId = item._id;
  }

  onSelectAddActor(item) {
    this.fullName = item.name;
    this.bYear = item.bYear;
    this.actorId = item._id;
    this.added = "";
  }
  onUpdateActor() {
    let obj = { name: this.fullName, bYear: this.bYear };
    this.dbService.updateActor(this.actorId, obj).subscribe(result => {
      this.onGetActors();
    });
  }

  onAddActor(item) {
    this.added = "SUCCESSFULLY ADDED!!"
    this.movieName = item.title;
    this.year = item.year;
    this.movieId = item._id
    let obj = { _id: this.actorId, name: this.fullName, bYear: this.bYear };
    this.dbService.addActor(this.movieId, obj).subscribe(result => {
      this.onGetMovies();
    });
    
  }

  //Delete Actor
  onDeleteActor(item) {
    this.dbService.deleteActor(item._id).subscribe(result => {
      this.onGetActors();
    });
  }

  onDeleteMovie(item) {
    this.dbService.deleteMovie(item._id).subscribe(result => {
      this.onGetMovies();
    });
  }
  onDeleteMovieBFYear(bfYear){
    this.dbService.deleteMovieBFYear(bfYear).subscribe(result => {
      this.onGetMovies();
    })
  }
  // This lifecycle callback function will be invoked with the component get initialized by Angular.
  ngOnInit() {
    this.onGetActors();
    this.onGetMovies();
  }

  changeSection(sectionId) {
    this.section = sectionId;
    this.resetValues();
  }

  resetValues() {
    this.fullName = "";
    this.bYear = 0;
    this.actorId = "";
    this.movieName = "";
    this.movieId = "";
    this.year = 0;
    this.expandedList = [];
    this.added = "";
  }
}
