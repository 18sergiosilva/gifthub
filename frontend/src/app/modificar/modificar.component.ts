import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.component.html',
  styleUrls: ['./modificar.component.scss']
})
export class ModificarComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {}

  email: string;
  nombre: string; //NOMBRE
  apellido: string;
  edad : number
  password: string


  //nombre_producto: string; //NOMBRE
  //vendedor_producto: string;
  //descripcion_producto: string;
  //precio_producto: string;
  //etiquetas_producto: string;
  //id = String(this.route.snapshot.params['id']);

  ngOnInit() {
    this.cargarProducto();
  }

  cargarProducto(): boolean {
    try{
      //this.http.get('https://35.239.230.8:5000/usuario/arnol' + this.id)
      this.http.get('http://35.239.230.8:5000/usuario/arnol')
      .toPromise().then((data: any) => {
        this.email = data.usuario.correo
        this.nombre = data.usuario.nombres
        this.apellido = data.usuario.apellidos
        this.edad = data.usuario.edad
        this.password = data.usuario.contrasena
        console.log(data.usuario.correo)
        //this.etiquetas_producto = this.getString(data.tags);
      });
    return true;

    } catch(error){
      
    }
  }

  getString(arreglo: string[]): string {
    try {
      return arreglo.toString();
    } catch(error){
      
    }
    
  }

  getTags(precio_producto: string): string[] {
    try{
      return precio_producto.split(',');
    } catch(error){
      
    }
  }

  imprimirConsola(impresion :any):number{
    try{
      console.log(impresion)
      return 1;
    } catch(error){
     
    }
    

  }

  editarProducto():boolean {
    try{
      //this.http.put('https://ayd1g6-cotizador.herokuapp.com/productos/' + this.id
      this.http.put('http://35.239.230.8:5000/usuario/arnol',
      {
        'nombres':this.nombre,
        'apellidos':this.apellido,
        'edad':this.edad,
        'contrasena':this.password,
        'correo':this.email
      }).toPromise().then((data: any) => {
        this.imprimirConsola(data);
        //this.router.navigate(['productos']);
      });
      return true;

    } catch(error){
      
    }
    
  }

  cancelar(): number {
    try{

      this.email = '';
      this.nombre = '';
      this.apellido = '';
      this.edad = 0;
      this.password = '';
      return -1;
    } catch(error){

    }
    
  }

}
