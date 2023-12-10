const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const mangaDirektori = require("../service/mangaDirektori");

const multer = require("multer");
// const upload = multer({ dest: 'uploads/' }) // definisikan folder tujuan upload disini

const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

/* GET Manga */
router.get("/", async function (req, res, next) {
  try {
    res.json(await mangaDirektori.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error mengambil data Manga `, err.message);
    next(err);
  }
});

router.post(
  "/",
  upload.single("file_komik"), // isi dengan nama kolom yang akan digunakan untuk mengupload file
  [
    body().custom((value, { req }) => {
      if (
        req.file.mimetype !== "image/png" &&
        req.file.mimetype !== "application/pdf"
      ) {
        throw new Error("Type File Harus PDF/PNG");
      }

      if (req.file.size > 150000) {
        throw new Error("File Harus Kurang Dari 15mb");
      }

      return true;
    }),
  ],
  async function (req, res, next) {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      res.json(await mangaDirektori.create(req.body, req.file));
    } catch (err) {
      console.error(`Error membuat data manga`, err.message);
      next(err);
    }
  }
);

router.put(
  "/:id",
  upload.single("file_komik"),
  [
    body().custom((value, { req }) => {
      if (
        req.file.mimetype !== "image/png" &&
        req.file.mimetype !== "application/pdf"
      ) {
        throw new Error("Type File Harus PDF/PNG");
      }

      if (req.file.size > 150000) {
        throw new Error("File Harus Kurang Dari 15mb");
      }

      return true;
    }),
  ],
  async function (req, res, next) {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      res.json(await mangaDirektori.update(req.params.id, req.body, req.file));
    } catch (err) {
      console.error(`Error Update data manga`, err.message);
      next(err);
    }
  }
);

router.delete("/:id", async function (req, res, next) {
  try {
    res.json(await mangaDirektori.remove(req.params.id));
  } catch (err) {
    console.error(`Error saat menghapus manga`, err.message);
    next(err);
  }
});

module.exports = router;
