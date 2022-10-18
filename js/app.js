// Campos del Formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// User Interface
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas =document.querySelector('#citas');

let editando;

class Citas{
    constructor(){
        this.citas = [];
    }
    //agregar cita
    agregarCita(cita){
        this.citas = [...this.citas, cita];
    }
    eliminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id)
    }
    editarCita(citaActualizada){
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    } //MAP porque retorna un nuevo arreglo
}

class UI{

    imprimirAlerta(mensaje, tipo){
        //crear div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        //Agregar clase en base al tipo de Error
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        } else{
            divMensaje.classList.add('alert-success');
        }

        //mensaje de Error
        divMensaje.textContent = mensaje;

        //agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'))
    
        //quitar alerta después de 5 sg
        setTimeout( () => {
            divMensaje.remove();
        }, 5000)
    }

    //sintaxis para destructuring - p/acceder mas directa los valores
    imprimirCitas({citas}){
        this.limpiarHTML();

        citas.forEach( cita =>{
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            //agrego atributo del id
            divCita.dataset.id = id;

            //Scripting de los elem de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
                <span class="font-weight-bolder">Propietario: </span> ${propietario}
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
                <span class="font-weight-bolder">Teléfono: </span> ${telefono}
            `;
            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
                <span class="font-weight-bolder">Fecha de Consulta: </span> ${fecha}
            `;
            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
                <span class="font-weight-bolder">Hora de Consulta: </span> ${hora}
            `;
            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
                <span class="font-weight-bolder">Síntomas: </span> ${sintomas}
            `;

            //btn eliminar citas
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

            btnEliminar.onclick = () => eliminarCita(id)

            //btn de editar citas
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';

            btnEditar.onclick = ()=> funcionEditar(cita);
            
            //agregar parrafo a divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            //agregar parrafo al HTML
            contenedorCitas.appendChild(divCita); 
        })        
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }
}


//instancias
const ui = new UI();
const adminCitas = new Citas();


// Registrar Eventos
eventListeners();
function eventListeners(){
    mascotaInput.addEventListener('change', datosCita);
    propietarioInput.addEventListener('change', datosCita);
    telefonoInput.addEventListener('change', datosCita);
    fechaInput.addEventListener('change', datosCita);
    horaInput.addEventListener('change', datosCita);
    sintomasInput.addEventListener('change', datosCita);

    //formulario
    formulario.addEventListener('submit', nuevaCita);
}

// Objeto Principal
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

// Agrega datos al Obj de Cita
function datosCita(e){
    //sintaxis de [ ] p/acceder a las prop del obj
    citaObj[e.target.name] = e.target.value;
};

// Valida y agrega una nueva cita a la class Citas
function nuevaCita(e){
    e.preventDefault();

    //Extraer info del Obj Citas
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    //validar
    if(mascota ===''|| propietario === ''|| telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error')
        return;
    }

    if(editando){
        ui.imprimirAlerta('Editado correctamente');

        //pasar objeto de la cita a edicion
        adminCitas.editarCita({...citaObj})

        //btn de guardado vuelva al estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        // y para qe se reinicie formulario, pondremos editando en false
        editando = false;
    } else{
        //generar ID unico
        citaObj.id = Date.now();

        //creando una nueva cita -->> ({...citaObj}) <<sintaxis p/ qe no reescriba y cree una copia del obj
        adminCitas.agregarCita({...citaObj});

        //msj de agregado correctamente
        ui.imprimirAlerta('Se agregó cita correctamente');
    }

    //reiniciar el obj p/ validacion
    reiniciarObj();

    //reinicia form
    formulario.reset();

    //mostrar en HTML - x metodos - adminCitas tiene referencia del arreglo con el metodo
    ui.imprimirCitas(adminCitas);
}

//cdo hago click en agregar x mas qe este vacio los campos REagrega el ultimo obj
//esto es xq reinicie formulario pero sigue teniendo valores el obj, entonces lo reinicio
function reiniciarObj(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

function eliminarCita(id){
    //Eliminar cita
    adminCitas.eliminarCita(id);
    
    // Muetre msj 
    ui.imprimirAlerta('La cita se eliminó correctamente...');

    //refresque citas en HTML
    ui.imprimirCitas(adminCitas);
}

function funcionEditar(cita){
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
    
    //llenar los inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //llenar el Obj
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id; //xq estamos en modo edicion

    //cambiar texto de btn
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';
    editando = true;

}
