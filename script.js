const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");
const responseText = document.getElementById("responseText");
const ctx = canvas.getContext("2d");
let capturedBlob = null;

// Accede a la cámara del dispositivo
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error("Error al acceder a la cámara:", err);
    responseText.textContent = "  No se pudo acceder a la cámara.";
  });

// Toma la foto y la envía automáticamente
captureBtn.addEventListener("click", () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  canvas.toBlob(blob => {
    capturedBlob = blob;
    enviarFoto(blob);
  }, "image/jpeg");
});

// Envío al servidor
function enviarFoto(blob) {
  const formData = new FormData();
  formData.append("file", blob, "foto.jpg");

  responseText.textContent = "⏳ Enviando imagen...";

  fetch("https://monumentos-historicos-e45c66f49b57.herokuapp.com/predict", {
    method: "POST",
    body: formData
  })
    .then(res => res.json()) // Cambiado a res.json() para analizar la respuesta como JSON
    .then(data => {
      if (data.monument) {
        responseText.textContent = "Monumento: " + data.monument;
      } else {
        responseText.textContent = "  No se pudo identificar el monumento.";
      }
    })
    .catch(err => {
      console.error("Error al enviar la imagen:", err);
      responseText.textContent = "  Error al enviar la imagen.";
    });
}
