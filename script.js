var convertBtn = document.querySelector('#convertBtn');
var URLinput = document.querySelector('#urlInput');

convertBtn.addEventListener('click', () => {
    sendURL(URLinput.value);
    URLinput.value = '';
});

function sendURL(URL) {
    window.location.href = `http://localhost:4000/download?url=${URL}`;
}