import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../Models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = "https://dummyjson.com/";

  constructor(private HttpClient:HttpClient) { }

  getAll():Observable<any>{
    return this.HttpClient.get(this.url+'products')
  }

  getSingle(id:number):Observable<any>{
    return this.HttpClient.get(this.url+'products/'+id)
  }

  add(producto:Product):Observable<any>{
    return this.HttpClient.post(this.url+'products/add',producto)
  }

  update(id:number,producto:Product):Observable<any>{
    return this.HttpClient.patch(this.url+'products/'+id,producto)
  }

  delete(id:number):Observable<any>{
    return this.HttpClient.delete(this.url+"products/"+id)
  }
}
