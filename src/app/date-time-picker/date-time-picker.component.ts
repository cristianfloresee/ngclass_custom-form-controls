// + NgbDateStruct for??

//ANGULAR
import { Component, OnInit, Input, forwardRef, ViewChild, AfterViewInit, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl } from '@angular/forms';
//NG-BOOTSTRAP
import { NgbTimeStruct, NgbDateStruct, NgbPopoverConfig, NgbPopover, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
//MODELS
import { DateTimeModel } from './date-time.model';

@Component({
    selector: 'app-date-time-picker',
    templateUrl: './date-time-picker.component.html',
    styleUrls: ['./date-time-picker.component.scss'],
    providers: [
        DatePipe,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateTimePickerComponent),
            multi: true
        }
    ]
})
export class DateTimePickerComponent implements ControlValueAccessor, OnInit, AfterViewInit {
    //For DatePicker
    @Input() dateString: string; //[ngModel]

    //Pipe Format: 02/09/2017 23:02
    @Input() inputDatetimeFormat = 'dd/MM/yyyy HH:mm';
    

    //Propiedades Input del TimePicker
    @Input() hourStep = 0;
    @Input() minuteStep = 0;
    @Input() secondStep = 0;
    @Input() seconds = false;

    @Input() disabled = false; //[disabled] for DatePicker and TimePicker

    @ViewChild(NgbDatepicker) private dp: NgbDatepicker;
    @ViewChild(NgbPopover) private popover: NgbPopover;

    private showTimePickerToggle = false;

    private datetime: DateTimeModel = new DateTimeModel();
    private firstTimeAssign = true;

    private ngControl: NgControl;

    constructor(
        private config: NgbPopoverConfig,
        private inj: Injector
    ) {
        //Popover Config
        config.autoClose = 'outside';
        config.placement = 'auto';
    }

    ngOnInit(): void {
        this.ngControl = this.inj.get(NgControl);
    }

    ngAfterViewInit(): void {
        //Popover
        this.popover.hidden.subscribe($event => {
            this.showTimePickerToggle = false;
        });
    }

    //Función a llamar cuando el input cambia.
    //onTouched: () => void = noop;
    onTouched = () => {};
    //CVA: Función a llamar cuando el input es tocado.
    //onChange: (value: any) => void = noop;
    onChange = (_) => {};

    //Necesaria en ControlValueAccesor
    // Escribe un valor en el input
    writeValue(newModel: string) {
        console.log("newModel: ", newModel);
        if (newModel) {
            console.log("intento1");
            this.datetime = Object.assign(this.datetime, DateTimeModel.fromLocalString(newModel));
            this.dateString = newModel;
            this.setDateStringModel();
        } else {
            this.datetime = new DateTimeModel();
        }
    }

    //Necesaria en ControlValueAccesor
    // Para indicar a Angular cuando cambia el valor del Input
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    //Necesaria en ControlValueAccesor
    // Para indicar a Angular cuando se toca en Input
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    //Necesaria en ControlValueAccesor
    // Para desactivar el input
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    toggleDateTimeState($event) {
        this.showTimePickerToggle = !this.showTimePickerToggle;
        $event.stopPropagation();
    }

    


    onDateChange($event) { //: string | NgbDateStruct 
        //console.log('date change: ', typeof($event.day));      
        if ($event.year) {
            $event = `${$event.year}-${$event.month < 10 ? '0' + $event.month: $event.month}-${$event.day < 10 ? '0' + $event.day: $event.day}`
            //console.log("event: ", $event);
        }

        console.log("intento2");
        const date = DateTimeModel.fromLocalString($event);

        if (!date) {
            this.dateString = this.dateString;
            return;
        }

        if (!this.datetime) this.datetime = date;


        this.datetime.year = date.year;
        this.datetime.month = date.month;
        this.datetime.day = date.day;

        this.dp.navigateTo({ year: this.datetime.year, month: this.datetime.month });
        
        this.setDateStringModel();
    }

    //No problem...
    onTimeChange(event: NgbTimeStruct) {
        //console.log("time change: ", event);
        this.datetime.hour = event.hour;
        this.datetime.minute = event.minute;
        this.datetime.second = event.second;
        //console.log(`hour: ${this.datetime.hour}, minute: ${this.datetime.minute}, second: ${this.datetime.second}`)
        this.setDateStringModel();
    }

    setDateStringModel() {
        this.dateString = this.datetime.toString();

        if (!this.firstTimeAssign) {
            this.onChange(this.dateString);
        } else {
            // Skip very first assignment to null done by Angular
            if (this.dateString !== null) {
                this.firstTimeAssign = false;
            }
        }
    }

    inputBlur($event) {
        //console.log("inputBlur: ", $event);
        //this.onTouched();
    }

    onInputChange($event: any) {
        console.log("onInputChange: ", $event);
        const value = $event.target.value;
        console.log("intento3");
        const dt = DateTimeModel.fromLocalString(value);
        console.log("dt: ", dt)

        if (dt) {
            this.datetime = dt;
            this.setDateStringModel();
        } else if (value.trim() === '') {
            this.datetime = new DateTimeModel();
            this.dateString = '';
            this.onChange(this.dateString);
        } else {
            this.onChange(value);
        }
    }
}
