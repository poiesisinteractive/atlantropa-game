function showModal(html){ document.getElementById('ovm').innerHTML=html; document.getElementById('ov').style.display='flex'; }
function hideModal(){ document.getElementById('ov').style.display='none'; }
window.hideModal = hideModal;

export { showModal, hideModal };
