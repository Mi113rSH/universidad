import { useState, useEffect } from 'react';
//useState guarda los datos llenados en los campos
//useEffect permite ejecutar acciones en el programa
import './App.css';

function App() {
    // Estados individuales para cada campo de tu base de datos
    const [nombre, setNombre] = useState(''); //Se dejan comillas vacias porque no se sabe que va a llenar el usuario
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [titulo, setTitulo] = useState('');
    const [areaAcademica, setAreaAcademica] = useState('');
    const [dedicacion, setDedicacion] = useState('');
    const [anosExperiencia, setAniosExperiencia] = useState(0); //Se coloca 0 ya que son valores numericos
    //Guardar los resultados en una lista
    const [registros, setRegistros] = useState([]);
    //Forma en la que arrancan las opciones del sistema
    const [editIndex, setEditIndex] = useState(null); //Los campos inician vacios
    //Busca la lista y carga todos los decentes en ella
    useEffect(() => {
      cargarDocentes();
    }, []);

    const cargarDocentes = async() => {
      try {
        //Le ponemos la ruta de donde va a encontrar la información de los docentes
        const response = await fetch("http://localhost:3001/docentes");
        //Expecifica el formato en el cual se retornan los datos
        const data = await response.json();
        //Se guardan los datos en la lista ya creada
        setRegistros(data);
      } catch(error) {
        alert("Error al cargar los docentes");
      }
    };

    //Función para limpiar el formulario
    const limpiarFormulario = () => {
      setNombre("");
      setCorreo("");
      setTelefono("");
      setTitulo("");
      setAreaAcademica("");
      setDedicacion("");
      setAniosExperiencia(0);
    };

    const registrarDatos = async(e) => {
      e.preventDefault();

      const payload = {
        nombre,
        correo,
        telefono: telefono,
        titulo: titulo,
        area_academica: areaAcademica,
        dedicacion: dedicacion,
        anios_experiencia: anosExperiencia
      };

      //Si los campos no están vacios, debe actualizar y no registrar
      if (editIndex !== null) {
        try {
          const docente = registros[editIndex];
          const response = await fetch(`http://localhost:3001/docentes/${docente.id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            const nuevosRegistros = [...registros];
            nuevosRegistros[editIndex] = {
              ...docente,
              nombre,
              correo,
              titulo: titulo,
              telefono: telefono,
              area_academica: areaAcademica,
              dedicacion: dedicacion,
              anios_experiencia: anosExperiencia
            };
            setRegistros(nuevosRegistros);
            setEditIndex(null);
            alert("Docente actualizado correctamente");
          } else {
            const err = await response.json().catch(() => ({}));
            alert(err.error || "Error al actualizar el docente");
          }
        } catch(error) {
          alert("Error de conexión al actualizar");
        }
      } else {
        try {
          const response = await fetch("http://localhost:3001/docentes", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
          });
          const data = await response.json();

          if (response.ok) {
            setRegistros([...registros, data]);
            alert("Docente guardado correctamente");
          } else {
            alert(data.error || "Error al guardar el docente");
          }
        } catch(error) {
          alert("Error de conexión al guardar");
        }
      }
      limpiarFormulario();
    }; //Cierre de registrarDatos

    const eliminarRegistro = async(idx) => {
      const docente = registros[idx];

      try {
        const response = await fetch(`http://localhost:3001/docentes/${docente.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setRegistros(registros.filter((_, i) => i !== idx));
          if (editIndex === idx) {
            setEditIndex(null);
            limpiarFormulario();
          }
          alert("Docente eliminado correctamente");
        } else {
          alert("Error al eliminar el docente");
        }
      } catch(error) {
        alert("Error de conexión al eliminar el docente");
      }
    };

    const editarRegistro = (idx) => {
      const reg = registros[idx];
      setNombre(reg.nombre);
      setCorreo(reg.correo);
      setTelefono(reg.telefono);
      setTitulo(reg.titulo);
      setAreaAcademica(reg.area_academica);
      setDedicacion(reg.dedicacion);
      setAniosExperiencia(reg.anios_experiencia);
      setEditIndex(idx);
    };

    return (
      <div>
        <h1>Gestión de docentes universitarios</h1>
        <p>Registro de profesores: datos académicos y de contacto</p>

        <form onSubmit={registrarDatos}>

          {/* Fila 1 */}
          <div>
            <div>
              <label>Nombre completo:</label>
              <input
                type="text"
                placeholder="Ej. María Fernanda López"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div>
              <label>Correo institucional:</label>
              <input
                type="email"
                placeholder="nombre@universidad.edu"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
            <div>
              <label>Teléfono:</label>
              <input
                type="text"
                placeholder="Ej. +57 300 1234567"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
            <div>
              <label>Título académico máximo:</label>
              <input
                type="text"
                placeholder="Ej. Doctorado, Maestría, E..."
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            <div>
              <label>Área o programa académico:</label>
              <input
                type="text"
                placeholder="Ej. Ingeniería de Software..."
                value={areaAcademica}
                onChange={(e) => setAreaAcademica(e.target.value)}
              />
            </div>
          </div>

          {/* Fila 2 */}
          <div>
            <div>
              <label>Dedicación:</label>
              <input
                type="text"
                placeholder="Tiempo completo, medio ti..."
                value={dedicacion}
                onChange={(e) => setDedicacion(e.target.value)}
              />
            </div>
            <div>
              <label>Años de experiencia docente:</label>
              <input
                type="number"
                value={anosExperiencia}
                onChange={(e) => setAniosExperiencia(e.target.value)}
              />
            </div>
          </div>

          <button type="submit">{editIndex !== null ? "Actualizar" : "Registrar"}</button>

        </form>

        {/* Tabla de registros */}
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Título</th>
              <th>Área académica</th>
              <th>Dedicación</th>
              <th>Años doc.</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((reg, idx) => (
              <tr key={idx}>
                <td>{reg.nombre}</td>
                <td>{reg.correo}</td>
                <td>{reg.telefono}</td>
                <td>{reg.titulo}</td>
                <td>{reg.area_academica}</td>
                <td>{reg.dedicacion}</td>
                <td>{reg.anios_experiencia}</td>
                <td>
                  <button className="editar" onClick={() => editarRegistro(idx)}>Editar</button>
                  <button className="eliminar" onClick={() => eliminarRegistro(idx)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    );
} //Cierre de function App()

export default App;