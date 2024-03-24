import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PatientserviceService } from '../service/patientservice.service';


@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, HttpClientModule],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.css',
  providers: [PatientserviceService, HttpClient]
})

export class PatientFormComponent implements OnInit {
  @ViewChild('patientFormRef') patientFormRef: any;

  patientForm!: FormGroup;
  datas: any;
  ageInYears: any;
  ageInMonths: any;
  ageInDays: any;

  diagnostic: { lsex: string, linf: string, lsup: string, catalog_key: string, nombre: string }[] = [];
  dataFilter: any;

  showDiagnosticSelect: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientserviceService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getData();
  }

  initializeForm() {
    this.patientForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      sex: ['', [Validators.required]],
      temperature: ['', [Validators.required]],
      height: ['', [Validators.required]],
      weight: ['', [Validators.required]],
      oxygenSaturation: ['', [Validators.required]],
      motiveConsultation: ['', [Validators.required]],
      diagnosisSelect: ['']
    });
  }

  calculateAge() {
    const birthDateControl = this.patientForm.get('birthDate');

    if (birthDateControl !== null) {
      const birthDate: Date = new Date(birthDateControl.value);
      const currentDate: Date = new Date();

      const diffTime = Math.abs(currentDate.getTime() - birthDate.getTime());
      this.ageInYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
      this.ageInMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.4375));
      this.ageInDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      //Formato 000X
      if (this.ageInYears < 10) {
        this.ageInYears = "00" + this.ageInYears + "A";
        console.log("Edad en años:", this.ageInYears);
      } else {
        this.ageInYears = "0" + this.ageInYears + "A";
        console.log("Edad en años:", this.ageInYears);
      }
      if (this.ageInMonths < 10) {
        this.ageInMonths = "00" + this.ageInMonths + "M";
        console.log("Edad en meses:", this.ageInMonths);
      } else if (this.ageInMonths > 100) {
        this.ageInMonths = this.ageInMonths + "M";
        console.log("Edad en meses:", this.ageInMonths);
      } else {
        this.ageInMonths = "0" + this.ageInMonths + "M";
        console.log("Edad en meses:", this.ageInMonths);
      }
      if (this.ageInDays < 10) {
        this.ageInDays = "00" + this.ageInDays + "D";
        console.log("Edad en días:", this.ageInDays);
      } else {
        this.ageInDays = "0" + this.ageInDays + "D";
        console.log("Edad en días:", this.ageInDays);
      }
    }

    this.search();
  }

  search() {
    this.dataFilter = [];
    const sex = this.patientForm.get('sex')?.value;
    this.diagnostic.forEach(i => {
      if (i.linf === 'NO' && i.lsup === 'NO') {
        if (sex == 'MUJER' && i.lsex == 'MUJER') {
          this.dataFilter.push({ catalog_key: i.catalog_key, nombre: i.nombre });
        } else if (sex === 'HOMBRE' && i.lsex == 'HOMBRE') {
          this.dataFilter.push({ catalog_key: i.catalog_key, nombre: i.nombre });
        }
      } else {
        if (this.ageInYears !== "000A" || this.ageInMonths !== "000M" || this.ageInDays !== "000D") {
          if (this.ageInYears === i.linf || this.ageInMonths === i.lsup) {
            this.dataFilter.push({ catalog_key: i.catalog_key, nombre: i.nombre });
          }
        }
      }
    });
  }

  getData(): void {
    this.patientService.getData()
      .subscribe(data => {
        this.datas = data;
        //eliminar despues de pruebas
        console.log(this.datas);
        this.datas.forEach((item: { lsex: string, linf: string, lsup: string, catalog_key: string, nombre: string }) => {
          this.diagnostic.push({ lsex: item.lsex, linf: item.linf, lsup: item.lsup, catalog_key: item.catalog_key, nombre: item.nombre });
        });
      });

    //eliminar despues de pruebas
    console.log(this.diagnostic);
  }

  selectDiagnostic(event: any) {
    if (event && event.target) {
      const selectedValue = event.target.value;
      //eliminar despues de pruebas
      console.log("Diagnóstico seleccionado:", selectedValue);
    }
  }

  showDiagnostic() {
    if (this.patientFormRef.form.valid) {
      this.patientFormRef.form.markAllAsTouched();

      this.showDiagnosticSelect = true;
    } else {
      alert("Faltan campos, por favor complete todos los campos obligatorios.");
    }
  }

}


