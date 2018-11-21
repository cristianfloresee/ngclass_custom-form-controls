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
    //Pipe Format de Angular: 02/09/2017 23:02
    @Input() inputDatetimeFormat = 'dd/MM/yyyy HH:mm';

    //For DatePicker?????
    @Input() dateString: string; //[ngModel]

    //Propiedades Input del TimePicker???
    @Input() hourStep = 0;
    @Input() minuteStep = 0;
    @Input() secondStep = 0;
    @Input() seconds = false;

    //Para deshabilitar el DatePicker/TimePicker
    @Input() disabled = true;

    @ViewChild(NgbDatepicker) private dp: NgbDatepicker;
    @ViewChild(NgbPopover) private popover: NgbPopover;

    //Para saber cuando mostrar el DatePicker/TimePicker
    private showTimePickerToggle = false;

    private datetime: DateTimeModel = new DateTimeModel();
    private firstTimeAssign = true;

    private ngControl: NgControl;

    constructor(
        config: NgbPopoverConfig,
        private inj: Injector
    ) {
        //Popover Config
        // + outside: cerrar el popover al hacer click afuera
        // + placement: posición del popover
        config.autoClose = 'outside';
        config.placement = 'auto';
    }

    // ----------------------------------------
    // Hooks
    // ----------------------------------------
    ngOnInit(): void {
        this.ngControl = this.inj.get(NgControl);
    }

    ngAfterViewInit(): void {
        //Cuando el Popover se oculta cambia el estado de showTimePickerToggle
        this.popover.hidden.subscribe(() => {
            this.showTimePickerToggle = false;
        });
    }

    //Función a llamar cuando el input cambia.
    //onTouched: () => void = noop;
    onTouched = () => { };
    //CVA: Función a llamar cuando el input es tocado.
    //onChange: (value: any) => void = noop;
    // Almacena la función que es registrada por registerOnChange
    // Se llama en el evento (change)
    onChange = (_) => { };

    // ----------------------------------------
    // ControlValueAccessor
    // ----------------------------------------

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

    // Para indicar a Angular cuando cambia el valor del Input
    // + Registra una función para el (change)?
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    // Para indicar a Angular cuando se toca en Input
    // + Registra una función para el (touched)?
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    // Para deshabilitar el input
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    // ----------------------------------------
    // 
    // ----------------------------------------

    toggleDateTimeState($event) {
        this.showTimePickerToggle = !this.showTimePickerToggle;
        $event.stopPropagation();
    }




    onDateChange($event) { //: string | NgbDateStruct 
        //console.log('date change: ', typeof($event.day));      
        if ($event.year) {
            $event = `${$event.year}-${$event.month < 10 ? ('0' + $event.month) : $event.month}-${$event.day < 10 ? ('0' + $event.day) : $event.day}`
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
