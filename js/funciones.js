import Citas from './classes/Citas.js';
import UI from './classes/UI.js';

import { mascotaInput, 
    propietarioInput, 
    telefonoInput, 
    fechaInput, 
    horaInput, 
    sintomasInput, 
    formulario
} from './selectores.js';

//instancias
const adminCitas = new Citas();
const ui = new UI(adminCitas);

let editando = false;

// Objeto Principal
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
};

// Agrega datos al Obj de Cita
export function datosCita(e){
    //sintaxis de [ ] p/acceder a las prop del obj
    citaObj[e.target.name] = e.target.value;
};


// Valida y agrega una nueva cita a la class Citas
export function nuevaCita(e){
    e.preventDefault();

    //Extraer info del Obj Citas
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    //validar
    if(mascota ===''|| propietario === ''|| telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error')
        return;
    }

    if(editando){
        //pasar objeto de la cita a edicion
        adminCitas.editarCita({...citaObj})
        
        ui.imprimirAlerta('Editado correctamente');

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
export function reiniciarObj(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

export function eliminarCita(id){
    //Eliminar cita
    adminCitas.eliminarCita(id);
    
    // Muetre msj 
    ui.imprimirAlerta('La cita se eliminó correctamente...');

    //refresque citas en HTML
    ui.imprimirCitas(adminCitas);
}

export function funcionEditar(cita){
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

