const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const fs = require('fs')

async function getMultiple(page = 1) {
  const rows = await db.query(
    `SELECT id, judul, penulis, penerbit, tanggal_rilis, rating, jumlah_volume, url_baca
    FROM manga`
  );
  const data = helper.CekRow(rows);
  return {
    data
  };
}

//CREATE
async function create(mangaData, fileMangaData) {
  try {
    const result = await db.query(
      `INSERT INTO manga 
      (judul, penulis, penerbit, tanggal_rilis, rating, jumlah_volume, url_baca) 
      VALUES 
      ('${mangaData.judul}', '${mangaData.penulis}', '${mangaData.penerbit}', '${mangaData.tanggal_rilis}', ${mangaData.rating}, ${mangaData.jumlah_volume}, 'http://localhost:3000/uploads/${fileMangaData.originalname}')`
    );

    if (result.affectedRows) {
      return { message: 'Manga created successfully' };
    } else {
      return { message: 'Error in creating manga' };
    }
  } catch (error) {
    console.error(error)
    // Handle any database errors here
    return { message: 'Error in creating manga' };
  }
}

//UPDATE
async function update(id, mangaData, fileMangaData) {
  try {
    const row = await db.query(
      `SELECT * FROM manga WHERE id = ${id}`
    );
    if (row.length > 0) {
      const singleRow = row[0]
      let url_baca = singleRow.url_baca
      if (fileMangaData) {
        const getBasePathFile = url_baca.replace("http://localhost:3000/", "public/");
        if (await fs.existsSync(getBasePathFile)) {
          await fs.unlinkSync(getBasePathFile);
        }
        // ubah value dari url baca menjadi nama file baru
        url_baca = `http://localhost:3000/uploads/${fileMangaData.originalname}`;
      }
      const result = await db.query(
        `UPDATE manga 
        SET judul="${mangaData.judul}", penulis="${mangaData.penulis}", penerbit="${mangaData.penerbit}", 
        tanggal_rilis="${mangaData.tanggal_rilis}", rating=${mangaData.rating}, jumlah_volume=${mangaData.jumlah_volume}, 
        url_baca="${url_baca}"
        WHERE id=${id}`
      );

      if (result.affectedRows) {
        return { message: 'Manga updated successfully' };
      } else {
        return { message: 'Error in updating manga' };
      }
    } else {
      return { message: 'Manga not found' };
    }
  } catch (error) {
    // Handle any database errors here
    return { message: 'Error in updating manga' };
  }
}

//DELETE
async function remove(id) {
  try {
    const row = await db.query(
      `SELECT * FROM manga WHERE id = ${id}`
    );
    if (row.length > 0) {
      const singleRow = row[0]
      const getBasePathFile = singleRow.url_baca.replace("http://localhost:3000/", "public/");
      if (await fs.existsSync(getBasePathFile)) {
        await fs.unlinkSync(getBasePathFile);
      }

      const result = await db.query(
        `DELETE FROM manga WHERE id=${id}`
      );

      if (result.affectedRows) {
        return { message: 'Manga berhasil dihapus' };
      } else {
        return { message: 'Error saat menghapus' };
      }
    } else {
      return { message: 'Manga not found' };
    }
  } catch (error) {
    // Handle any database errors here
    return { message: 'Error saat menghapus' };
  }
}



module.exports = {
  getMultiple,
  create,
  update,
  remove
};
