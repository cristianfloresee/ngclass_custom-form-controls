//ANGULAR
import { DatePipe } from '@angular/common';
//NG-BOOTSTRAP
import { NgbTimeStruct, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export interface NgbDateTimeStruct extends NgbDateStruct, NgbTimeStruct { }

export class DateTimeModel implements NgbDateTimeStruct {
    year: number;
    month: number;
    day: number;

    hour: number;
    minute: number;
    second: number;

    timeZoneOffset: number;

    public constructor(init?: Partial<DateTimeModel>) {
        console.log("init: ", init); //Llega con un day menos
        Object.assign(this, init);
    }

    //No Problem: Only for Date
    public static fromLocalString(dateString: string): DateTimeModel {
        console.log("dateString1: ", dateString);
        const date = new Date(dateString + 'T12:00:00Z'); //acá se va a la mierda...
        //date.setDate(date.getDate() + 1);
        console.log("date: ", date);

        const isValidDate = !isNaN(date.valueOf());

        if (!dateString || !isValidDate) return null;

        const x = new DateTimeModel({
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds(),
            timeZoneOffset: date.getTimezoneOffset()
        });

        //console.log("x: ", x)
        return x;
    }

    //No Problem: Usado en Fecha
    private isInteger(value: any): value is number {
        //console.log("integer: ", value);
        return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
    }

    //No Problem here
    public toString(): string {
        console.log("mes: ", this.month);
        console.log("day: ", this.day);

        if (this.isInteger(this.year) && this.isInteger(this.month) && this.isInteger(this.day)) {
            const year = this.year.toString().padStart(2, '0');
            const month = this.month.toString().padStart(2, '0'); // 9 => 09
            const day = this.day.toString().padStart(2, '0'); // 2 => 02 
            if (!this.hour) this.hour = 0;
            if (!this.minute) this.minute = 0;
            if (!this.second) this.second = 0;
            if (!this.timeZoneOffset) this.timeZoneOffset = new Date().getTimezoneOffset();


            const hour = this.hour.toString().padStart(2, '0');
            const minute = this.minute.toString().padStart(2, '0');
            const second = this.second.toString().padStart(2, '0');
            console.log("month2: ", this.month);
            console.log("day2: ", this.day);

            const tzo = -this.timeZoneOffset;
            const dif = tzo >= 0 ? '+' : '-',
                pad = function (num) {
                    const norm = Math.floor(Math.abs(num));
                    return (norm < 10 ? '0' : '') + norm;
                };

            const isoString = `${pad(year)}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}${dif}${pad(tzo / 60)}:${pad(tzo % 60)}`;
            console.log("isoString: ", isoString);
            return isoString;
        }
        return null;
    }
}

