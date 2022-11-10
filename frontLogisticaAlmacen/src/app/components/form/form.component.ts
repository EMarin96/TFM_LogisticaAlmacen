import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { EmployeeService } from 'src/app/services/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  userForm: FormGroup
  type: string = 'Registrar';
  constructor(
    private employeeServices: EmployeeService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) { 
    this.userForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]),

      first_last_name: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20)
      ]),

      second_last_name: new FormControl('', [
        Validators.required,
      ]),

      email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
      ]),

      dni: new FormControl('', [
      Validators.required,
      ]),

      cell_phone: new FormControl('', [
      Validators.required,
      ]),

      birth_date: new FormControl('', [
      Validators.required,
      ])
    })

  }

  async getDataForm(): Promise<void>{
    if (this.userForm.valid) { }
    else {
      Swal.fire(
        'Informacion!',
        'El formulario no esta bien relleno',
        'info'
      );
    }

    let newEmployee = this.userForm.value;
    if (newEmployee.id) {
      let response = await this.employeeServices.update(newEmployee);
      if (response.id) {
        Swal.fire(
          'OK!',
          'Employee actualizado',
          'success')
          .then((result) => {
            this.router.navigate(['/home-jefe']);
          });
      }
      else {
        Swal.fire(
          'Error!',
          response.error,
          'error')
          .then((result) => {
            this.router.navigate(['/home-jefe']);
          });
      }
    }  
    else {
      let response = await this.employeeServices.create(newEmployee)
      if(response.id) {
        Swal.fire(
          'OK!',
          'Usuario creado',
          'success')
          .then((result) => {
            this.router.navigate(['/home-jefe']);
        });
      }
    
      else {
        Swal.fire(
          'Error!',
          'Hubo un error',
          'error')
          .then((result) => {
            this.router.navigate(['/home-jefe']);
        });
      }
    } 
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(async(params:any) => {
      let id: number = parseInt(params.iduser);
      if (id) {
        this.type = 'Actualizar'
        const response = await this.employeeServices.getById(id)
        const user: User = response
        this.userForm = new FormGroup({
          name: new FormControl(user?.name,[]),
          first_last_name: new FormControl(user?.first_last_name, []),
          second_last_name: new FormControl(user?.second_last_name, []),
          email: new FormControl(user?.email, []),
          dni: new FormControl(user?.dni, []),
          cell_phone: new FormControl(user?.cell_phone, []),
          birth_date: new FormControl(user?.birth_date, []),
          id: new FormControl(user?.id, [])
        }, [])
      }
    })

  }

  checkControl(pControlName: string, pError: string): boolean{
    if(this.userForm.get(pControlName)?.hasError(pError) && this.userForm.get(pControlName)?.touched){
      return true;
    } 
    else {
      return false;
    }
  }

}
