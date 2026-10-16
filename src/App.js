import React, { useState } from 'react';
import './App.css';

export default function App() {
  // Estado inicial con las imágenes base y su contador de likes
  const [imagenes, setImagenes] = useState([
    { id: 1, nombre: 'Argentina', url: `${process.env.PUBLIC_URL}/imagenes/argentina.png`, likes: 0 },
    { id: 2, nombre: 'Brasil', url: `${process.env.PUBLIC_URL}/imagenes/brasil.png`, likes: 0 },
    { id: 3, nombre: 'Colombia', url: `${process.env.PUBLIC_URL}/imagenes/colombia.png`, likes: 0 },
    { id: 4, nombre: 'Chile', url: `${process.env.PUBLIC_URL}/imagenes/chile.png`, likes: 0 },
    { id: 5, nombre: 'Uruguay', url: `${process.env.PUBLIC_URL}/imagenes/uruguay.png`, likes: 0 },
    { id: 6, nombre: 'Bolivia', url: `${process.env.PUBLIC_URL}/imagenes/bolivia.png`, likes: 0 },
    { id: 7, nombre: 'Perú', url: `${process.env.PUBLIC_URL}/imagenes/peru.png`, likes: 0 },
    { id: 8, nombre: 'Venezuela', url: `${process.env.PUBLIC_URL}/imagenes/venezuela.png`, likes: 0 }
  ]);

  const [indiceActual, setIndiceActual] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Navegación
  const siguiente = () => {
    if (indiceActual < imagenes.length - 1) {
      setIndiceActual(indiceActual + 1);
    }
  };

  const anterior = () => {
    if (indiceActual > 0) {
      setIndiceActual(indiceActual - 1);
    }
  };

  // 1. Eliminar imagen actual
  const eliminarImagen = () => {
    if (imagenes.length === 0) return;

    const nuevasImagenes = imagenes.filter((_, index) => index !== indiceActual);
    setImagenes(nuevasImagenes);

    // Ajustar el índice si eliminamos la última disponible
    if (indiceActual >= nuevasImagenes.length && nuevasImagenes.length > 0) {
      setIndiceActual(nuevasImagenes.length - 1);
    }
  };

  // 2. Subir nueva imagen desde el equipo
  const subirImagen = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const nuevaImagen = {
      id: Date.now(),
      nombre: archivo.name.split('.')[0],
      url: URL.createObjectURL(archivo),
      likes: 0
    };

    setImagenes([...imagenes, nuevaImagen]);
    setIndiceActual(imagenes.length); // Mover el visor a la imagen recién subida
    e.target.value = null; // Reiniciar input
  };

  // 3. Dar "Me gusta" a la imagen actual
  const darLike = () => {
    const nuevas = imagenes.map((img, index) => {
      if (index === indiceActual) {
        return { ...img, likes: img.likes + 1 };
      }
      return img;
    });
    setImagenes(nuevas);
  };

  const imagenActual = imagenes[indiceActual];

  return (
    <div className="container">
      <h1>Galería de Imágenes Dinámica</h1>

      {/* Control para subir imágenes */}
      <div className="upload-box">
        <label htmlFor="file-upload" className="btn-upload">
          Subir Imagen
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={subirImagen}
          style={{ display: 'none' }}
        />
      </div>

      {imagenes.length > 0 ? (
        <div className="card">
          <h3>{imagenActual.nombre}</h3>
          
          {/* Clic en la imagen abre el modal */}
          <img
            src={imagenActual.url}
            alt={imagenActual.nombre}
            className="main-image"
            onClick={() => setModalAbierto(true)}
            title="Haz clic para ver en pantalla completa"
          />

          <div className="nav-controls">
            <button onClick={anterior} disabled={indiceActual === 0}>
              &lt; Anterior
            </button>
            <span>{indiceActual + 1} / {imagenes.length}</span>
            <button onClick={siguiente} disabled={indiceActual === imagenes.length - 1}>
              Siguiente &gt;
            </button>
          </div>

          <div className="action-controls">
            <button className="btn-like" onClick={darLike}>
              Me gusta ({imagenActual.likes})
            </button>
            <button className="btn-delete" onClick={eliminarImagen}>
              Eliminar
            </button>
          </div>
        </div>
      ) : (
        <p>No hay imágenes en la galería. ¡Sube una nueva!</p>
      )}

      {/* 4. Modal para ver la imagen en grande */}
      {modalAbierto && imagenActual && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setModalAbierto(false)}>
              &times;
            </span>
            <img src={imagenActual.url} alt={imagenActual.nombre} className="modal-image" />
            <p>{imagenActual.nombre} - {imagenActual.likes} Likes</p>
          </div>
        </div>
      )}
    </div>
  );
}