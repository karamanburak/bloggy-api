//? Blog Models
const mongoose = require("mongoose");

const nameSchema = new mongoose.Schema(
  {
    //_id : Auto Generated
    // fieldName: String, // shorthand
    fieldName: {
      type: String, // Veri Tipi
      required: true, // Gelen veriden zorunlu olarak olsun mu ?
      required: [true, "Error-Message"], //* Hata mesajını özelleştirme
      trim: true, // Gelen veriyi trimden geçir
      unique: true, // Benzersiz olmalı
      index: true, // Daha hızlı erişim olsun mu ?
      select: true, // Data çağrıldığında bu alan gelsin mi gelmesin mi ?
      validate: [
        function (data) {
          return true;
        },
        "Error-Message",
      ], //* veriyi kontrolden geçiren fonksiyon
      enum: [["0", "1", "2", "3"], "error-message"], //* Choices / Pattern / Limit
      get: function (data) {
        return data;
      }, // Data çağrılırken çalışan fonksiyon
      set: function (data) {
        return data;
      }, // Datayı kaydederken çalışan fonksiyon
    },
  },
  {
    collection: "collectionName",
    timestamps: true, // CreatedAt ve UpdatedAt auto
  }
);
