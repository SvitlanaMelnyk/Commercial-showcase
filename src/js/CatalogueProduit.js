// Créer un module "CatalogueProduit"

var CatalogueProduit = (function(){
    var App = {};

    // Les paramètres par défaut
    var pageActuelle = 1; // la page sélectionné (
    var nombreProduitParPage = 12; // le nombre de produit par page
    var modeAffichage = "vignette"; // le mode d'affichage
    var prElement = 0; // le premier élément du produit
    var dernElement = 0; // le dernier élément du produit
    var nombrePage = Math.ceil(produit.length / nombreProduitParPage); // calculer le nombre de pages
    var panierProduit = {}; // panier

    // Appeler la fonction sauvegarder les données dans LocalStorage
    loadStorage();

    // Créer le template du CatalogueProduit
    var produitTemplate = document.createElement("template");
    produitTemplate.innerHTML = '<article class="produit"> ' +
    '<header class="nom">{{nomProduit}}</header> ' +
    '<section class="image"><img src="{{imageProduit}}"></section> ' +
    '<section class="description">{{descriptionProduit}}</section> ' +
    '<section class="prix"> <span class="prix-valeur">{{prixValeurProduit}}</span> <span class="prix-unite">${{prixUniteProduit}}</span> </section> ' +
    '<section class="categorie">{{categorieProduit}}</section> </article>';
    var btn = document.createElement("button"); // Créer le button "Ajouter au panier" dans le template
    btn.innerHTML = 'Ajouter au panier';
    btn.value = "{{idProduit}}"; // donner la valeur du button
    btn.classList.add('btn', 'btn-warning'); // donner la class du button
    produitTemplate.content.firstElementChild.appendChild(btn);
    produitTemplate.content.querySelector('img').classList.add('img-fluid'); // donner la class de l'image
    produitTemplate.content.querySelector('.categorie').classList.add('card-footer'); // donner la class de la section de categorie


    window.addEventListener('load', function () {

        // Appeler la fonction  mettre à jour le panier
        panierNouveau();
    });


    // Fonction sauvegarder les données dans LocalStorage
    function loadStorage(){
        if (localStorage.getItem("panierProduit") === null){
            localStorage.setItem("panierProduit", JSON.stringify({}));
        } else {
            panierProduit = JSON.parse(localStorage.getItem("panierProduit"));
        }
    }

    // Fonction mettre à jour le panier
    function panierNouveau() {
        document.getElementById("btnPanierContent").innerHTML = Object.keys(panierProduit).length;
    }

    // Fonction pagination
    function pagination(){
        var sList = document.getElementById("list");
        sList.innerHTML = "";

        var isPrecedent = false;
        var isSuivant = false;
        var isPages = false;

        // Créer le button Précédent
        if (pageActuelle > 1) {
            sList.innerHTML += '<li class="page-item"><a class="page-link" id="precedent">Précédent</a></li>';
            isPrecedent = true;
        }

        // Créer la pagination
        for (var i = 1; i <= nombrePage; i++) {
            sList.innerHTML += '<li class="page-item page-nombre"><a class="page-link"  >' + i + '</a></li>';
            isPages = true;
        }

        // Créer le button Suivant
        if(pageActuelle < nombrePage){
            sList.innerHTML += '<li class="page-item suivant"><a class="page-link" >Suivant</a></li>' ;
            isSuivant = true;
        }

        // Vérification le button Précédent
        if (isPrecedent) {
            sList.querySelector('#precedent').addEventListener('click', function () {
                pageActuelle--;
                App.afficher();
            });
        }

        // Vérification la pagination
        if (isPages) {
            var pageLinks = sList.querySelectorAll(".page-nombre");
            for (var i = 0; i < pageLinks.length; i++) {
                pageLinks[i].addEventListener('click', function(ev) {
                    App.changerPage(parseInt(ev.target.innerHTML));
                    App.afficher();
                });
            }
        }

        // Vérification le button Suivant
        if (isSuivant){
            sList.querySelector('.suivant').addEventListener('click', function () {
                pageActuelle++;
                App.afficher();
            });
        }
    }

    // Fonction Afficher le catalogue de produits
    App.afficher = function(){
        var produitFiche = document.getElementById("affichage");
        produitFiche.innerHTML = "";

        // Changer le mode d'affichage
        if(modeAffichage === "vignette" ){
            document.getElementById("affichage").className= "card-deck";
        }
        if(modeAffichage === "liste" ){
            document.getElementById("affichage").className= "liste";
        }

        // Changer le nombre de produit par page
        prElement = (pageActuelle - 1) * nombreProduitParPage;
        if (nombrePage === pageActuelle){
            dernElement = produit.length;
        }else{
            dernElement = pageActuelle * nombreProduitParPage;
        }

        var templateHTML = produitTemplate.innerHTML;
        var templateRemplacer = "";

        for (var element = prElement; element < dernElement; element++){
                templateRemplacer = templateHTML
                    .replace(/{{idProduit}}/, produit[element].id)
                    .replace(/{{nomProduit}}/, produit[element].nom)
                    .replace(/{{imageProduit}}/, produit[element].image)
                    .replace(/{{descriptionProduit}}/, produit[element].description)
                    .replace(/{{prixValeurProduit}}/, produit[element].prix.valeur)
                    .replace(/{{prixUniteProduit}}/, produit[element].prix.unite)
                    .replace(/{{categorieProduit}}/, produit[element].categorie)

                var elem = document.createRange().createContextualFragment(templateRemplacer);
                produitFiche.appendChild(elem.cloneNode(true)); // Cloner des éléments de produit

            }

        // Appeler addEventListener dans le panier
        var arrayProd = document.querySelectorAll('#affichage button');
        for (var i = 0; i < arrayProd.length; i++){
            arrayProd[i].addEventListener('click', function(ev){
                App.ajouterProduit(parseInt(ev.target.value));
            });
        }

        pagination(); // Appeler la fonction pagination
    }

        // Fonction ChangerPage affiche le gestionnaire de page
    App.changerPage = function(numPage){
        pageActuelle = numPage; // actualiser la page actuelle

        if (pageActuelle < 1){
            pageActuelle = 1;
        }
        if(pageActuelle > nombrePage ){
            pageActuelle = nombrePage;
        }

        App.afficher();
    }

        // Fonction setNombreParPage change le nombre de produit par page
    App.setNombreParPage = function (nombre){
        nombreProduitParPage = parseInt(nombre); // actualiser le nombre de produit par page
        nombrePage = Math.ceil(produit.length / nombreProduitParPage); // calculer le nombre de pages
        pageActuelle = 1;
        App.afficher();
    }

        // FonctionsetModeAffichage : function(){},
    App.setModeAffichage = function (mode){
        modeAffichage = mode; // actualiser le mode d'affichage
        App.afficher();
    }

    // ajouterProduit : function(produit){}
    App.ajouterProduit = function(produit){
        panierProduit[produit] = produit; // actualiser l'id de produit
        panierNouveau(); // mettre à jour le panier
        localStorage.setItem("panierProduit", JSON.stringify(panierProduit)); // sauvegarder les données dans LocalStorage
    }


    return App;

})();
