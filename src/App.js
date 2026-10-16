import React, { useState } from 'react';
import './App.css';

export default function App() {
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

  const eliminarImagen = () => {
    if (imagenes.length === 0) return;
    const nuevas = imagenes.filter((_, index) => index !== indiceActual);
    setImagenes(nuevas);
    if (indiceActual >= nuevas.length && nuevas.length > 0) {
      setIndiceActual(nuevas.length - 1);
    }
  };

  const subirImagen = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const nuevaImagen = {
      id: Date.now(),
      nombre: archivo.name.replace(/\.[^/.]+$/, ""),
      url: URL.createObjectURL(archivo),
      likes: 0
    };

    const actualizadas = [...imagenes, nuevaImagen];
    setImagenes(actualizadas);
    setIndiceActual(actualizadas.length - 1);
    e.target.value = null;
  };

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
    <div className="app-wrapper">
      <header className="app-header">
        <h1>Galería Interactiva</h1>
        <p className="subtitle">Visualizador con gestión de imágenes y estados</p>

        <div className="upload-container">
          <label htmlFor="file-upload" className="btn-upload">
            <span className="icon">📁</span> Subir nueva imagen
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={subirImagen}
            style={{ display: 'none' }}
          />
        </div>
      </header>

      <main className="gallery-layout">
        {imagenes.length > 0 ? (
          <div className="gallery-card">
            <div className="card-top">
              <span className="country-badge">{imagenActual.nombre}</span>
              <span className="counter-pill">{indiceActual + 1} de {imagenes.length}</span>
            </div>

            <div className="image-viewport" onClick={() => setModalAbierto(true)} title="Clic para ampliar">
              <img
                src={imagenActual.url}
                alt={imagenActual.nombre}
                className="displayed-image"
              />
              <div className="zoom-hint">🔍 Ampliar</div>
            </div>

            <div className="nav-bar">
              <button
                className="btn-nav"
                onClick={anterior}
                disabled={indiceActual === 0}
              >
                ◀ Anterior
              </button>
              <button
                className="btn-nav"
                onClick={siguiente}
                disabled={indiceActual === imagenes.length - 1}
              >
                Siguiente ▶
              </button>
            </div>

            <div className="actions-bar">
              <button className="btn-action btn-heart" onClick={darLike}>
                ❤️ Me gusta <span className="like-counter">{imagenActual.likes}</span>
              </button>
              <button className="btn-action btn-trash" onClick={eliminarImagen}>
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-card">
            <p>No hay imágenes disponibles en la colección.</p>
            <label htmlFor="file-upload" className="btn-upload empty-btn">
              Sube la primera
            </label>
          </div>
        )}
      </main>

      {/* Modal tipo pantalla completa */}
      {modalAbierto && imagenActual && (
        <div className="modal-backdrop" onClick={() => setModalAbierto(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalAbierto(false)}>
              &times;
            </button>
            <img src={imagenActual.url} alt={imagenActual.nombre} className="modal-img-full" />
            <div className="modal-info">
              <h3>{imagenActual.nombre}</h3>
              <p>❤️ {imagenActual.likes} Me gusta</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}