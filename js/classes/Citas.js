
// Classes
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
};

export default Citas;