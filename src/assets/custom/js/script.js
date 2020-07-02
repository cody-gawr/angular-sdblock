
function limitInput(event, value, limit) {
    if (value.length >= limit || event.keyCode < 48 || event.keyCode > 57) {
        event.preventDefault(); 
    }
}