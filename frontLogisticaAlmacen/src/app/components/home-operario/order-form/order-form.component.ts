import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/interfaces/order.interface';
import { Warehouse } from 'src/app/interfaces/warehouse.interface';
import { OrdersService } from 'src/app/services/orders.service';
import { WarehousesService } from 'src/app/services/warehouses.service';
import * as dayjs from 'dayjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
})
export class OrderFormComponent implements OnInit {
  action: String = 'Ingresar';
  warehouses: Warehouse[] = [];
  orderForm: FormGroup;
  constructor(
    private warehousesServices: WarehousesService,
    private ordersService: OrdersService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.orderForm = new FormGroup(
      {
        outDate: new FormControl('', [Validators.required]),
        truckPlate: new FormControl('', [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(10),
        ]),
        origin: new FormControl('', [this.warehouseValidator]),
        destiny: new FormControl('', [this.warehouseValidator]),
        comment: new FormControl('', []),
      },
      [this.checkWarehouses]
    );
  }

  async ngOnInit(): Promise<void> {
    this.warehouses = await this.warehousesServices.getAll();
    this.activatedRoute.params.subscribe(async (params: any) => {
      let id = parseInt(params.orderId);
      if (id) {
        this.action = 'Actualizar';
        try {
          let response = await this.ordersService.getById(id);
          if (response.id) {
            this.orderForm = new FormGroup(
              {
                id: new FormControl(response.id, []),
                outDate: new FormControl(
                  dayjs(response.out_date).format('YYYY-MM-DD'),
                  [Validators.required]
                ),
                truckPlate: new FormControl(response.truck_plate, [
                  Validators.required,
                  Validators.minLength(7),
                  Validators.maxLength(10),
                ]),
                origin: new FormControl(response.originId, [
                  this.warehouseValidator,
                ]),
                destiny: new FormControl(response.destinyId, [
                  this.warehouseValidator,
                ]),
                comment: new FormControl(response.comment, []),
              },
              [this.checkWarehouses]
            );
          }
        } catch (error) {
          Swal.fire(String(error), '', 'error');
        }
      }
    });
  }

  async getDataForm(): Promise<void> {
    let order: Order = {
      id: this.orderForm.value.id,
      out_date: this.orderForm.value.outDate,
      truck_plate: this.orderForm.value.truckPlate,
      originId: this.orderForm.value.origin,
      destinyId: this.orderForm.value.destiny,
      stateId: 1,
      comment: this.orderForm.value.comment,
    };

    if (order.id) {
      try {
        let response = await this.ordersService.update(order.id, order);
        if (response.affectedRows > 0)
          this.router.navigate(['/home-operario', 'home']);
      } catch (error: any) {
        error.error.forEach((err: any) => {
          Swal.fire(err.error, '', 'error');
        });
      }
    } else {
      try {
        let response = await this.ordersService.create(order);
        if (response.id) this.router.navigate(['/home-operario', 'home']);
      } catch (error: any) {
        error.error.forEach((err: any) => {
          Swal.fire(err.error, '', 'error');
        });
      }
    }
  }

  warehouseValidator(pControlName: AbstractControl): any {
    const warehouse: number = parseInt(pControlName.value);
    if (isNaN(warehouse)) {
      return { warehouseValidator: 'Debe seleccionar un almacén' };
    }
  }

  checkWarehouses(pFormValue: AbstractControl): any {
    const origin: number = parseInt(pFormValue.get('origin')?.value);
    const destiny: number = parseInt(pFormValue.get('destiny')?.value);

    if (!isNaN(origin) && origin === destiny) {
      return { checkwarehouses: true };
    } else return null;
  }

  changeOrigin(event: any): void {
    this.orderForm.value.origin = event.target.value;
    console.log(this.orderForm.value.origin);
  }

  changeDestiny(event: any): void {
    this.orderForm.value.destiny = event.target.value;
    console.log(this.orderForm.value.destiny);
  }

  checkControl(pControlName: string, pError: string): boolean {
    if (
      this.orderForm.get(pControlName)?.hasError(pError) &&
      this.orderForm.get(pControlName)?.touched
    ) {
      return true;
    } else {
      return false;
    }
  }
}