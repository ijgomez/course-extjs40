var secuenciaIdCliente = 0;
var secuenciaIdPedido = 0;
var secuenciaIdProducto = 0;

//-------------------------------------------------

Ext.define(
	"Cliente",
	{
		//id: ++secuenciaIdCliente, //Esto es para la definición de las constantes asociadas al tipo
		constructor: function(config){
			this.id = ++secuenciaIdCliente;
			this.nombre = config.nombre;
		},
		getId: function(){
			return this.id;
		},
		getnombre: function(){
			return this.nombre;
		},
		setNombre: function(nombre){
			this.nombre = nombre;
		},
		toString: function(){
			return "{'id': " + this.id + ", 'nombre': " + this.nombre +"}";
		},
		toHtml: function(){
			return {
				tag: "div",
				id: "cliente" + this.id,
				html: this.nombre
			};
		}
	}
);

//-------------------------------------------------

Ext.define(
	"ClienteAvanzado",
	{
		extend: "Cliente",
		constructor: function(config){
			this.callParent(arguments);
			this.direccion = config.direccion;
		},
		realizarNuevoPedido: function(){
			
		}
	}
);

//-------------------------------------------------

Ext.define(
	"Pedido",
	{
		extend: "Ext.util.Observable",
		//id: ++secuenciaIdPedido,
		constructor: function(config){
			this.id = ++secuenciaIdPedido;
			this.cliente = config.cliente;
			this.productos = config.productos;
			this.addEvents('repintarProducto');
			this.listeners = config.listeners;
			this.callParent(arguments);
		},
		getId: function(){
			return this.id;
		},
		getCliente: function(){
			return this.cliente;
		},
		addProducto: function(producto){
			//Realizar el trabajo propio del metodo
			this.productos.push(producto);
			//Lanzar el evento que indica que se ha modificado los productos
			this.fireEvent('repintarProducto', producto);

		},
		removeProducto: function(posicion){
			this.productos.remove(this.productos[posicion]);
		},
		toString: function(){
			var resultado = "{'id':" + this.id + ",'cliente': " + this.cliente.toString();

			resultado += ",'productos': [";

			for (var i = 0; i < this.productos.length; i++) {
				resultado += this.productos[i].toString() + ", ";
			};

			resultado += "]}";

			return resultado;
		},
		toHtml: function(){
			
			var productos = new Array();

			for (var i = 0; i < this.productos.length; i++) {
				productos.push(this.productos[i].toHtml());
			};

			return {
				tag: "div",
				id: "pedido" + this.id,
				children:[
					this.cliente.toHtml(),
					{
						tag: "div",
						id: "productos",
						children: productos
					}
				]
			};
		}
	}
);

//-------------------------------------------------

Ext.define(
	"Producto",
	{
		constructor: function(config){
			this.id = ++secuenciaIdProducto;
			this.nombre = config.nombre;
			this.descricpion = config.descricpion;
		},
		getId: function(){
			return this.id;
		},
		getNombre: function(){
			return this.nombre;
		},
		setNombre: function(nombre){
			this.nombre = nombre;
		},
		getDescripcion: function(){
			return this.descricpion;
		},
		setDescripcion: function(descricpion){
			this.descricpion = descricpion;
		},
		toString: function(){
			return "{'id': " + this.id 
				+ ", 'nombre': " + this.nombre
				 + ", 'descricpion': " + this.descricpion +"}";
		},
		toHtml: function(){
			return {
				tag: "div",
				id: "producto" + this.id,
				children: [
					{
						tag: "div",
						id: "nombre producto" + this.id,
						html: this.nombre
					},{
						tag: "div",
						id: "descripcion producto" + this.id,
						html: this.descricpion
					}
				]
			};
		}
	}
);

//-------------------------------------------------

Ext.onReady(function(){
	var divCenter = Ext.get("center");

	//var c = new Cliente(1, "Victor");
	var c = Ext.create("Cliente", {nombre: "Victor"});

	//var p =  new Producto(1, "Telefono", "Telefono de ultima generacion");
	var p = Ext.create(
			"Producto", 
			{nombre: "Telefono", descricpion: "Telefono de ultima generacion"});

	var p1 = Ext.create(
			"Producto", 
			{nombre: "Telefono1", descricpion: "Telefono1 de ultima generacion"});

	var p2 = Ext.create(
			"Producto", 
			{nombre: "Telefono2", descricpion: "Telefono2 de ultima generacion"});

	//var pedido = new Pedido(1, c, [p]);
	var pedido = Ext.create(
						"Pedido", 
						{
							cliente: c, 
							productos: [p, p1, p2]/*,
							listeners: {
								repintarProducto: function(producto){
									var divProductos = Ext.get("productos");
									divProductos.createChild(producto.toHtml());

								} 
							}*/
						});

	divCenter.createChild(pedido.toHtml());

	var divFormulario = Ext.get("formulario");

	Ext.create("Ext.Button",{
		text: "Añadir nuevo Producto",
		renderTo: divFormulario,
		handler: function(){

			var inputNombre = Ext.get("nombre");
			var inputDescripcion = Ext.get("descripcion");

			var producto = Ext.create(
								"Producto", 
								{nombre: inputNombre.getValue(),
								descricpion: inputDescripcion.getValue()});	

			pedido.addProducto(producto);

			Ext.fly(divCenter).update(""); //Vacio el contenido de divCenter

			divCenter.createChild(pedido.toHtml()); //vuelvo a pintar todo el Pedido
		}
	});
});