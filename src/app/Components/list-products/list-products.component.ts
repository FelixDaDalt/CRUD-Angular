import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Product } from 'src/app/Models/product';
import { ProductService } from 'src/app/Services/product.service';


@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {

  listProducts = new Array<Product>()
  singleProduct!: Product;


  @Input() title!:string
  @Input() descripcion!:string
  @Input() precio!:number
  @Input() thumbnail!:string

  constructor(private productService:ProductService, private NGBmodalService:NgbModal) { }

  ngOnInit(): void {
    this.getAll()
  }

  getAll(){
    this.productService.getAll().subscribe(productos =>{
      this.listProducts = productos.products;
    })
  }

  //La Fake API simula el PUT por lo que no se actualiza en el servidor, sino que te devuelve el producto
  //modificado, por este motivo es que en el suscribe añado el responseProducto a la lista, previamente buscandolo
  //para reemplazarlo

  getProduct(id:number,template:any){
    this.productService.getSingle(id).subscribe(producto =>{
      this.singleProduct = producto
      this.NGBmodalService.open(template).result.then(()=>{
        var editProducto = new Product()
        editProducto.price = this.precio
        editProducto.title = this.title
        editProducto.description = this.descripcion
        if(editProducto != this.singleProduct){
          this.productService.update(id,editProducto).subscribe(responseProducto=>{
            let index = this.listProducts.findIndex(x => x.id === id)
            this.listProducts[index] = responseProducto
            this.NGBmodalService.dismissAll()
          })
        }
         this.NGBmodalService.dismissAll()
      })
    })
  }

  //La Fake API simula el POST por lo que no se agregar al servidor, sino que te devuelve el producto
  //con un id, por este motivo es que en el suscribe añado el responseProducto a la lista

  addProduct(ver:any){
      this.NGBmodalService.open(ver).result.then(()=>{
        var producto = new Product()
        producto.title = this.title
        producto.description = this.descripcion
        producto.price = this.precio
        producto.thumbnail = this.thumbnail
        this.productService.add(producto).subscribe(responseProducto =>{
            this.listProducts.push(responseProducto)
            this.NGBmodalService.dismissAll()
          })
        })
  }

  //La Fake API simula el DELETE por lo que no se elimina del servidor, sino que te devuelve en el response
  // la variable IsDeleted, por este motivo hago la comprobacion, si me devuelve TRUE, busco el producto en la
  //lista y lo elimino.
 
  deleteProduct(producto:Product){
     this.productService.delete(producto.id).subscribe( response=>{
      if(response.isDeleted){
        let index = this.listProducts.findIndex(x => x.id === producto.id)
        this.listProducts.splice(index,1)
        console.log(this.listProducts)
      }
     })   

  }

  
}
