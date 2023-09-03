const uploadBox = document.querySelector(".upload-box"),
  fileinput = uploadBox.querySelector("input[type='file']"),
  imgLoaded = uploadBox.querySelector("img"),
  widthInput = document.querySelector(".width input"),
  heightInput = document.querySelector(".height input"),
  ratioCheckbox = document.querySelector(".ratio input"),
  qualityCheckbox = document.querySelector(".quality input"),
  downloadBtn = document.querySelector(".download-btn");

let imageRatio;

const loadFile = (e) => {
  const file = e.target.files[0]; //Получаем первый выбранный файл
  if (!file) return; // Если не выбрана картинка то выходим из функции
  imgLoaded.src = URL.createObjectURL(file);
  imgLoaded.addEventListener("load", () => {
    //как только изображение подгрузилось вешаем на wrapper класс active

    widthInput.value = imgLoaded.naturalWidth;
    heightInput.value = imgLoaded.naturalHeight;
    imageRatio = imgLoaded.naturalWidth / imgLoaded.naturalHeight;
    document.querySelector(".wrapper").classList.add("active");
  });
};

widthInput.addEventListener("keyup", () => {
  //Получаем высоту по aspect ratio в зависимости от checked в чексбоксе
  const height = ratioCheckbox.checked
    ? widthInput.value / imageRatio
    : heightInput.value;
  heightInput.value = Math.floor(height);
});
heightInput.addEventListener("keyup", () => {
  //Получаем ширину по aspect ratio в зависимости от checked в чексбоксе
  const width = ratioCheckbox.checked
    ? heightInput.value * imageRatio
    : widthInput.value;
  widthInput.value = Math.floor(width);
});

const resizeAndDownload = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const a = document.createElement("a");
  //Если стоит галочка на чекбоксе про качество изобр. то меняем его качество при вызгрузке
  const imgQuality = qualityCheckbox.checked ? 0.7 : 1.0;
  //Устанавливаем ширину canvas в зависимости от ширины и высоты изображения
  canvas.width = widthInput.value;
  canvas.height = heightInput.value;
  ctx.drawImage(imgLoaded, 0, 0, canvas.width, canvas.height);

  //Передаем значения dataurl как значения тега <a>

  a.href = canvas.toDataURL("image/jpeg", imgQuality);
  a.download = new Date().getTime(); // Передаем текущее время как валью
  //Кликаем по ссылки для начала скачивания картинки
  a.click();
};

downloadBtn.addEventListener("click", resizeAndDownload);
fileinput.addEventListener("change", loadFile);
uploadBox.addEventListener("click", () => fileinput.click());
