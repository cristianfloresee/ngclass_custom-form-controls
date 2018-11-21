import { Component, OnInit  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observer, Subscription } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit  {
  datetimeChanges$: Subscription;
  formGroup : FormGroup;

  ngOnInit() {
    this.formGroup = new FormGroup({
      activeEndDate:  new FormControl(new Date(), {validators: [Validators.required, DateTimeValidator]})
    }, { updateOn: 'change' }); //¿Qué hace el updateOn?
    this.checkFormChanges();
  }

  checkFormChanges(){
    this.datetimeChanges$ = this.formGroup.get('activeEndDate').valueChanges.subscribe((changes)=>{
      console.log("\ncami: ", changes);
    })
  }
}



//Válida que la fecha/hora sea correcta
export const DateTimeValidator = (fc: FormControl) => {

    const date = new Date(fc.value);
    console.log("pika: ", date.valueOf());
    const isValid = !isNaN(date.valueOf());
    return isValid ? null : {
        isValid: {
            valid: false
        }
    };
};