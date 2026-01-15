const fetch = require('node-fetch');
const db = require('../config/database'); // tu database.js con mysql2/promise


// Traer animes de la API Jikan por página
async function fetchTopAnime(page = 1) {
  const res = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`);
  const data = await res.json();
  return data.data || [];
}

// Guardar o actualizar anime en la DB
async function saveOrUpdateAnime(anime) {
  // Revisar si ya existe
  const checkQuery = 'SELECT * FROM Anime WHERE titulo = ?';
  const [rows] = await db.execute(checkQuery, [anime.title]);

  const fechaEstreno = anime.aired?.from ? anime.aired.from.split('T')[0] : null;
  const numEpisodios = anime.episodes || null;
  const edad = anime.rating || 'N/A';
  const imagen = anime.images?.jpg?.image_url || null;
  const descripcion = anime.synopsis || '';

  if (rows.length > 0) {
    // Si existe, actualizamos campos que puedan cambiar
    const existing = rows[0];
    const updateQuery = `
      UPDATE Anime
      SET descripcion = ?, fecha_estreno = ?, num_episodios = ?, edad_recomendada = ?, imagen_portada = ?
      WHERE id_anime = ?
    `;
    await db.execute(updateQuery, [
      descripcion,
      fechaEstreno,
      numEpisodios,
      edad,
      imagen,
      existing.id_anime
    ]);
    console.log(`♻️ Actualizado: ${anime.title}`);
  } else {
    // Si no existe, insertamos
    const insertQuery = `
      INSERT INTO Anime (titulo, descripcion, fecha_estreno, num_episodios, edad_recomendada, imagen_portada)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.execute(insertQuery, [
      anime.title,
      descripcion,
      fechaEstreno,
      numEpisodios,
      edad,
      imagen
    ]);
    console.log(`✅ Guardado: ${anime.title}`);
  }
}

// Función principal: traer todas las páginas automáticamente
async function fillDatabase() {
  let page = 1;
  let totalFetched = 0;

  while (true) {
    console.log(`📄 Traer página ${page}`);
    try {
      const animes = await fetchTopAnime(page);
      if (animes.length === 0) break; // no hay más resultados
      totalFetched += animes.length;

      for (const anime of animes) {
        try {
          await saveOrUpdateAnime(anime);
        } catch (err) {
          console.error(`❌ Error guardando ${anime.title}:`, err.message);
        }
      }

      page++; // siguiente página
    } catch (err) {
      console.error(`❌ Error trayendo página ${page}:`, err.message);
      break;
    }
  }

  console.log(`🎉 Todos los animes procesados: ${totalFetched}`);
  process.exit(0);
}

// Ejecutar script
fillDatabase();
