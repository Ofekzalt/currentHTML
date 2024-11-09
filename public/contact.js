// // פונקציה לקבלת קואורדינטות מ-Geocoding API של Google
// function getCoordinates(address) {
//     return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=$AIzaSyBRyk9Z8-XbxDU1G7YRnrFA5wym96YiE24}`)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data); // הדפסת תגובת ה-API בקונסולה
//             if (data.status === "OK") {
//                 return data.results[0].geometry.location;
//             } else {
//                 throw new Error(`Unable to find location: ${data.status}`);
//             }
//         });
// }

// // פונקציה לטעינת המפה עם הקואורדינטות
// function initMap() {
//     getCoordinates("Beer Sheva 16, Yafo, Tel-Aviv,Israel")
//         .then(location => {
//             const map = new google.maps.Map(document.getElementById("map"), {
//                 zoom: 15,
//                 center: location,
//             });
//             new google.maps.Marker({
//                 position: location,
//                 map: map,
//                 title: "Beer Sheva 16, Yafo, Tel-Aviv",
//             });
//         })
//         .catch(error => console.error("Error:", error));
// }

// פונקציה לפתיחת WhatsApp
function openWhatsApp() {
    const phoneNumber = "972509290764"; 
    const message = "שלום, אני מעוניין במידע נוסף";
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}
