
//Clase de la fachada del motor de TAG

class TMotor{

 	constructor (gestorRecursos) {
        this.escena = new TNodo('Raiz', undefined, undefined);
        this.gestorRecursos = gestorRecursos;
        this.luzRegistro = [];
        this.luzActiva = [];
        this.camaraRegistro = [];
        this.camaraActiva = -1;
        this.mallaRegistro = [];
    }
	

	draw(){
		canvas=document.getElementById("my-canvas");
	    try{
	        gl=canvas.getContext("webgl");
	    }
	    catch(e){

	    }

	    if(gl){
	        console.log("Start drawing");
	        

	        //inicializamos el árbol (esto no se hará aquí)
	        //inicializar();

	        //Esto ya si, es la inicialización de la librería gráfica
	        //configuramos los shaders y le pasamos el nombre de los ficheros 
	        //que tenemos en recursos/shaders
	        //esta función está en content/utilities
	        configurarShaders('standardShader.vs', 'standardShader.fs');

	        glProgram.pMatrixUniform=gl.getUniformLocation(glProgram, "uPMatrix");
    		glProgram.mvMatrixUniform=gl.getUniformLocation(glProgram, "uMVMatrix");

    		
	        

	        setupWebGL();




	        
    		//dibujado del árbol, cuando llegue a la hoja, la dibujará en el canvas
	        this.escena.draw();
	    }
	    else{
	        alert("Error: Tu navegador no soporta WebGL");
	    }
	}

	/**
	 * Crea una camara con todos los controladores
	 * si hermano se deja a nulo lo crea en la raiz
	 * si no se tiene que indicar un nodo que no sea de
	 * transformacion 
	 * @param  {string} nombre      
	 * @param  {bool} perspective 
	 * @param  {TNodo} hermano     
	 * @return {TNodo}             
	 */
	crearNodoCamara(nombre, perspective, hermano){

		if( hermano !== undefined){
			console.log("crea un hermano");
			var rotCam = new TNodo(nombre + "_R",  new TTransf(), hermano.dad);
			var traCam = new TNodo(nombre + "_T",  new TTransf(), rotCam);
			var cam = new TNodo(nombre, new TCamara(perspective), traCam);
		}else{
			console.log("crea en raiz");
			var rotCam = new TNodo(nombre + "_R", new TTransf(), this.escena);
			var traCam = new TNodo(nombre + "_T",  new TTransf(), rotCam);
			var cam = new TNodo(nombre, new TCamara(perspective), traCam);
		}
		this.camaraRegistro.push(cam);
		
		return cam;
	}
	/**
	 * Crea una luz, se tiene que definir su nombre, 
	 * intensidad y si quieres que cuelgue de un hermano
	 * si no, se deja en undefined
	 * @param  {string} nombre     
	 * @param  {double} intensidad 
	 * @param  {TNodo | undefined} hermano    
	 * @return {TNodo}            
	 */
	crearNodoLuz(nombre, intensidad, hermano){

		if( hermano !== undefined){
			console.log("crea un hermano");
			var rotLuz = new TNodo(nombre + "_R",  new TTransf(), hermano.dad);
			var traLuz = new TNodo(nombre + "_T",  new TTransf(), rotLuz);
			var luz = new TNodo(nombre, new TLuz(intensidad), traLuz);
		}else{
			console.log("crea en raiz");
			var rotLuz = new TNodo(nombre + "_R", new TTransf(), this.escena);
			var traLuz = new TNodo(nombre + "_T",  new TTransf(), rotLuz);
			var luz = new TNodo(nombre, new TLuz(intensidad), traLuz);
		}
		this.luzRegistro.push(luz);
		this.luzActiva.push(0);
		return luz;
	}

	/**
	 * se le pasa un recurso y un hermano si queremos que
	 * cuelgue de la estructura de alguno de ellos.
	 * @param  {string} nombre  
	 * @param  {[type]} recurso 
	 * @param  {TNodo | undefined} hermano 
	 * @return {TNodo}         
	 */
	crearNodoMalla(nombre, recurso, hermano){

		if( hermano !== undefined){
			console.log("crea un hermano");

			var rotMalla = new TNodo(nombre + "_R", new TTransf(), hermano.dad);
			var traMalla = new TNodo(nombre + "_T", new TTransf(), rotMalla);
			var escMalla = new TNodo(nombre + "_S", new TTransf(), traMalla);
			var malla = new TNodo(nombre, new TMalla(recurso), escMalla);
		}else{
			console.log("crea en raiz");
			var rotMalla = new TNodo(nombre + "_R", new TTransf(), this.escena);
			var traMalla = new TNodo(nombre + "_T",  new TTransf(), rotMalla);
			var escMalla = new TNodo(nombre + "_S", new TTransf(), traMalla);
			var malla = new TNodo(nombre, new TMalla(recurso), escMalla);
		}
		this.mallaRegistro.push(malla);
		return malla;
	}
/** se le pasa el ?? por parametro y activa dicha camara */
	/*activarCamara(pos){
		if(pos>=0 && pos<=this.camaraActiva.length){
			var lastPos= this.camaraRegistro.indexOf(1);
			this.camaraActiva[lastPos] = 0;
			this.camaraActiva[pos] = 1;
			return this.camaraRegistro[pos];
		}else{
			return "no existe";
		}
	}*/

	/** se le pasa el nombre por parametro y activa dicha camara */
	activarCamara(nombre){

		var pos = -1;
		
		for (var i = 0; i< this.camaraRegistro.length; i++){
			if(nombre == this.camaraRegistro[i].name){
				pos = i;
				break;
			}
		}
		//console.log("pos " + pos);
		if(pos>=0){
			this.camaraActiva = pos;
			return this.camaraRegistro[this.camaraActiva];
		}else{
			return undefined;
		}

	}

	activarLuz(nombre){
		var pos = -1;
		
		for (var i = 0; i< this.luzRegistro.length; i++){
			if(nombre == this.luzRegistro[i].name){
				pos = i;
				break;
			}
		}
		if(pos>=0){
			this.luzActiva[pos] = 1;
			return this.luzRegistro[pos];
		}else{
			return undefined;
		}
	}

	desactivarLuz(nombre){
		var pos = -1;
		
		for (var i = 0; i< this.luzRegistro.length; i++){
			if(nombre == this.luzRegistro[i].name){
				pos = i;
				break;
			}
		}
		if(pos>=0){
			this.luzActiva[pos] = 0;
			return this.luzRegistro[pos];
		}else{
			return undefined;
		}
	}

	moverLuz(nombre, x, y, z){
		var pos = -1;
		
		for (var i = 0; i< this.luzRegistro.length; i++){
			if(nombre == this.luzRegistro[i].name){
				pos = i;
				break;
			}
		}
		
	}



	
}