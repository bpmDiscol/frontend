import { FilesCollection } from "meteor/ostrio:files";

function checkSize(size) {
  return size <= 10485760;
}
function checkFormat(regex_formats, file) {
  return regex_formats.test(file.extension);
}
function checkFile(size, regex_formats, file) {
  if (!checkSize(size)) return "El tamaño maximo del archivo es de 10Mb";
  if (!checkFormat(regex_formats, file))
    return "Formato no válido, solo se aceptan PNG, JPG, JPEG, PDF, DOC, DOCX, XLS y XLSX";
  return true;
}
export const backgroundCollection = new FilesCollection({
  collectionName: "backgroundFiles",
  storagePath: "/data/backgrounds",
  onBeforeUpload(file) {
    return checkFile(10485760, /png|jpg|jpeg|pdf|doc|docx|xls|xlsx/i, file);
  },
});

export const curricullumsCollection = new FilesCollection({
  collectionName: "curricullums",
  storagePath: "/data/curricullums",
  onBeforeUpload(file) {
    return checkFile(10485760, /png|jpg|jpeg|pdf|doc|docx|xls|xlsx/i, file);
  },
});
