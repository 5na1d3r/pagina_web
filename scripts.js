const form = document.getElementById('form-entrega');
const overlay = document.getElementById('overlay');
const resumen = document.getElementById('resumen');
const fileInput = document.getElementById('pdf');
const fileInfo = document.getElementById('file-info');

// Mostrar nombre del PDF al seleccionarlo
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const mb = (file.size / 1024 / 1024).toFixed(2);
    fileInfo.textContent = `📄 ${file.name} (${mb} MB)`;
  } else {
    fileInfo.textContent = '';
  }
});

// Validación
function validar() {
  let valido = true;

  const campos = [
    { id: 'nombre',    errId: 'err-nombre', msg: 'El nombre es obligatorio.' },
    { id: 'apellido',  errId: 'err-apellido', msg: 'El apellido es obligatorio.' },
    { id: 'ci',        errId: 'err-ci',      msg: 'La CI es obligatoria.' },
    { id: 'ru',        errId: 'err-ru',      msg: 'El RU es obligatorio.' },
    { id: 'num-lista', errId: 'err-lista',   msg: 'El número de lista es obligatorio.' },
  ];

  campos.forEach(({ id, errId, msg }) => {
    const input = document.getElementById(id);
    const err   = document.getElementById(errId);
    const valor = input.value.trim();

    if (!valor) {
      err.textContent = msg;
      input.classList.add('invalid');
      valido = false;
    } else {
      err.textContent = '';
      input.classList.remove('invalid');
    }
  });

  // Validar CI solo números
  const ciInput = document.getElementById('ci');
  const ciErr   = document.getElementById('err-ci');
  if (ciInput.value.trim() && !/^\d+$/.test(ciInput.value.trim())) {
    ciErr.textContent = 'La CI debe contener solo números.';
    ciInput.classList.add('invalid');
    valido = false;
  }

  // Validar PDF
  const pdfErr = document.getElementById('err-pdf');
  const file = fileInput.files[0];
  if (!file) {
    pdfErr.textContent = 'Debes adjuntar un archivo PDF.';
    fileInput.classList.add('invalid');
    valido = false;
  } else if (file.type !== 'application/pdf') {
    pdfErr.textContent = 'El archivo debe ser un PDF.';
    fileInput.classList.add('invalid');
    valido = false;
  } else if (file.size > 25 * 1024 * 1024) {
    pdfErr.textContent = 'El archivo no debe superar los 25 MB.';
    fileInput.classList.add('invalid');
    valido = false;
  } else {
    pdfErr.textContent = '';
    fileInput.classList.remove('invalid');
  }

  return valido;
}

// Envío del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validar()) return;

  const nombre   = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const ci       = document.getElementById('ci').value.trim();
  const ru       = document.getElementById('ru').value.trim();
  const lista    = document.getElementById('num-lista').value.trim();
  const archivo  = fileInput.files[0].name;
  const ahora    = new Date().toLocaleString('es-BO');

  resumen.innerHTML = `
    <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
    <p><strong>CI:</strong> ${ci}</p>
    <p><strong>RU:</strong> ${ru}</p>
    <p><strong>N° de Lista:</strong> ${lista}</p>
    <p><strong>Archivo:</strong> ${archivo}</p>
    <p><strong>Fecha y hora:</strong> ${ahora}</p>
  `;

  overlay.classList.add('visible');
});

// Cerrar modal y resetear
function cerrarModal() {
  overlay.classList.remove('visible');
  form.reset();
  fileInfo.textContent = '';
  document.querySelectorAll('.error').forEach(e => e.textContent = '');
  document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
}
