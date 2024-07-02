import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, Input, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CloudAppRestService, CloudAppEventsService, Request, HttpMethod,
  Entity, RestErrorResponse, AlertService
} from '@exlibris/exl-cloudapp-angular-lib';
import { MatInputModule } from '@angular/material/input';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  itemData: FormGroup;
  itemRec: any = null;
  setLocation: boolean = false;
  success = null;
  recResult = null;

  @ViewChild("barcode") barcodeField: ElementRef;
  @ViewChild("locationcode") locationField: ElementRef;

  constructor(
    private alert: AlertService,
    private itemService: ItemService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.itemData = this.initializeForm();
    console.log('Initializing Item Storage Locator');
  }

  ngOnDestroy(): void {
  }

  initializeForm() {
    return new FormGroup({
      barcode: new FormControl(),
      locationcode: new FormControl(),
      callnumber: new FormControl('')
    });
  }

  loadRecord() {
    this.loading = true;
    this.alert.clear();
    let newcode = this.itemData.get('barcode').value;
    this.clear()
    this.itemData.get('barcode').setValue(newcode);

    this.itemService.getItemByBarcode(this.itemData.get('barcode').value).pipe(
      finalize(() => this.loading = false)
    ).subscribe(
      item => {
        this.itemRec = item;
        this.itemData.get('callnumber').setValue(this.itemRec.holding_data.call_number);
      },
      error => {
        console.error(error),
        this.success = false;
          this.recResult = `Could not retrieve item with barcode ${this.itemData.get('barcode').value}`;
      }
    )
  }

  checkOverwrite() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { currentLocation: this.itemRec.item_data.storage_location_id },
      autoFocus: true
    });
    return dialogRef.afterClosed().toPromise()
      .then(result => {
        this.setLocation = result;
        return Promise.resolve(result);
      })
  }

  async set() {
    this.recResult = '';
    if (this.itemData.get('barcode').value && this.itemData.get('locationcode').value) {
      if (this.itemRec) {
        if (this.itemRec.item_data.storage_location_id == this.itemData.get('locationcode').value) {
          this.success = true;
          this.recResult = 'Item is already registered on this location';
        }
        else {
          if (this.itemRec.item_data.storage_location_id == '') {
            // Storage location ID is empty ==> set item storage location
            this.setLocation = true;
          }
          else if (this.itemRec.item_data.storage_location_id != this.itemData.get('locationcode').value) {
            const getPermission = await this.checkOverwrite();
          }

          if (this.setLocation) {
            this.loading = true;
            this.itemRec.item_data.storage_location_id = this.itemData.get('locationcode').value;
            this.itemService.setLocationID(this.itemRec).pipe(
              finalize(() => this.loading = false)
            ).subscribe(
              item => {
                this.itemRec = item;
                this.success = true;
                this.recResult = 'New storage location ID set';
              },
              error => {
                console.error(error),
                  this.success = false;
                this.recResult = 'Could not set new storage location ID';
              }
            )
          }
        }
      }
      else {
        this.success = false;
        this.recResult = `Could not retrieve item with barcode ${this.itemData.get('barcode').value}`;
      }
    }
    else {
      this.success = false;
      this.recResult = 'No valid barcode or location ID provided - cannot set storage location ID';
    }
  }

  lookup() {
    if (this.itemRec) {
      if (this.itemRec.item_data.storage_location_id != '') {
        this.itemData.get('locationcode').setValue(this.itemRec.item_data.storage_location_id);
      }
      else {
        this.success = false;
        this.recResult = 'No storage location ID found for this record';
      }
    }
    else {
      this.success = false;
      this.recResult = `Could not retrieve item with barcode ${this.itemData.get('barcode').value}`;
    }
  }

  verify() {
    if (this.itemRec) {
      if (this.itemRec.item_data.storage_location_id == this.itemData.get('locationcode').value) {
        this.success = true;
        this.recResult = 'Storage location ID correct!';
      }
      else if (this.itemRec.item_data.storage_location_id == '') {
        this.success = false;
        this.recResult = 'No storage location ID found for this record';
      }
      else {
        this.success = false;
        this.recResult = `Storage location ID does not match barcode. Item is registered on location ${this.itemRec.item_data.storage_location_id}`;
      }
    }
    else {
      this.success = false;
      this.recResult = `Could not retrieve item with barcode ${this.itemData.get('barcode').value}`;
    }
  }

  check() {
    this.recResult = '';
    if (this.itemRec) {
      // Value entered for location code ==> verify location ID
      if (this.itemData.get('locationcode').value) {
        this.verify();
      }
      // No value entered for location code ==> look up location ID
      else {
        this.lookup();
      }
    }
    else {
      this.success = false;
      this.recResult = `Could not retrieve item with barcode ${this.itemData.get('barcode').value}`;
    }
  }

  clear() {
    this.alert.clear();
    this.itemRec = null;
    this.setLocation = false;
    this.itemData.reset();
    this.success = null;
    this.recResult = '';
  }
}

@Component({
  selector: 'location-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./main.component.scss']
})

export class ConfirmationDialog {
  constructor(public dialogRef: MatDialogRef<ConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { currentLocation: string }
  ) { }
}