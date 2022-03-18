// carte centrée sur la France (latitude et longitude) et niveau de zoom = 6
let carte = L.map('mapid').setView([47.6, 2.5], 6);

// gestion du fond de carte
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(carte);

// création d'un nouveau type d'icone pour les villes étapes
const redIcon = new L.Icon({
   iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
   iconAnchor: [12, 41],
});

/**
 * Boucle sur les villes pour les afficher sur la carte
 * ====================================================
 * 
 * METHODE 1, approche plus objet que je conseille
 */
let clic = 1

villes.forEach( 
   function(ville) {

      // option du marqueur
      let markerOpts = {}

      // offset du marqueur
      let tooltipOffset = [-15,-15]

      // si on a un itinéraire de calculé et que la ville courante est dans cet itinéraire
      if(chemins != null && chemins.indexOf(ville.id) > -1) {
         markerOpts = {icon: redIcon}
         tooltipOffset = [1,-42]
      }

      // insertion du marqueur pour la ville en cours
      let marker = L.marker([ville.latitude, ville.longitude], markerOpts);
      // ajout à la carte
      marker.addTo(carte);
      // bulle avec texte
      marker.bindTooltip(
         ville.libelle /*+ ' (#'+ville.id+')'*/,
         {
            direction: "top",
            permanent: true,
            offset: tooltipOffset,
            opacity: 0.6 // semi transparente
         }
      ).openTooltip();
      
      // si on clic sur un marqueur, on change la boîte de sélection
      // clic pair = première boîte / clic impair = deuxième boite
      marker.on('click', function(e) {

         if( clic%2 ) {
            document.getElementById( 'villedepart' ).value = ville.id
         } else {
            document.getElementById( 'villearrivee' ).value = ville.id
            document.getElementById( 'itineraireForm' ).submit()
         }
         clic++

      })

   }
)


/**
 * Boucle sur les villes pour les afficher sur la carte
 * ====================================================
 * 
 * METHODE 2, approche boucle classique
 */
/*
for(let i=0; i<villes.length; i++)
{
   // insertion du marqueur pour la ville en cours
   let marker = L.marker([villes[i].latitude, villes[i].longitude]);
   // ajout à la carte
   marker.addTo(carte);
   // bulle avec texte
   marker.bindTooltip(
      villes[i].libelle,
      {
         direction: "top",
         permanent: true,
         offset: [0,-15], // on décale un peu la bulle vers le haut,
         opacity: 0.6 // semi transparente
      }
   ).openTooltip();
}
*/

/**
 * Affichage des distances
 * ====================================================
 */
console.log(chemins)
distances.forEach(
   function(distance) {
      
      // couleur de la ligne
      let couleur = 'grey'

      // si les 2 ID sont dans le tableau chemins, le tracé sera rouge
      if(
         chemins != null &&
         chemins.indexOf( distance.v1id )>-1 &&
         chemins.indexOf( distance.v2id )>-1 &&
         (
            chemins.indexOf( distance.v1id ) == chemins.indexOf( distance.v2id )-1 || 
            chemins.indexOf( distance.v1id ) == chemins.indexOf( distance.v2id )+1
         )
      ) {
            couleur = 'red'
      }

      // on construit notre tableau de points attendu par Polyline
      let trace = [
            [distance.v1lat, distance.v1lng],
            [distance.v2lat, distance.v2lng],
      ];
      
      // on affiche la ligne
      let polyline = L.polyline(trace, {color: couleur}).addTo(carte)
   }
)
