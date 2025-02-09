import Player from "./Player.js";
import Obstacle from "./Obstacle.js";
import ObjetSouris from "./ObjetSouris.js";
import { rectsOverlap } from "./collisions.js";
import { initListeners } from "./ecouteurs.js";
import Sortie from "./Sortie.js";
export default class Game {
    objetsGraphiques = [];

    constructor(canvas) {
        this.canvas = canvas;
        // etat du clavier
        this.inputStates = {
            mouseX: 0,
            mouseY: 0,
        };
        this.sortie = null;
        this.level = null;
    }

    async init(canvas) {
        this.ctx = this.canvas.getContext("2d");

        // On initialise les écouteurs de touches, souris, etc.
        this.inputStates = {};
        initListeners(this.inputStates, this.canvas);

        this.player = new Player(0, 0);

        this.level = 1;
        this.initLevel();
        console.log("Game initialisé");
    }

    start() {
        console.log("Game démarré");

        // On démarre une animation à 60 images par seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    mainAnimationLoop() {
        // 1 - on efface le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 2 - on dessine les objets à animer dans le jeu
        // ici on dessine le monstre
        this.drawAllObjects();

        // 3 - On regarde l'état du clavier, manette, souris et on met à jour
        // l'état des objets du jeu en conséquence
        this.update();

        // 4 - on demande au navigateur d'appeler la fonction mainAnimationLoop
        // à nouveau dans 1/60 de seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    drawAllObjects() {
        // Dessine tous les objets du jeu
        this.objetsGraphiques.forEach(obj => {
            obj.draw(this.ctx);
        });
    }

    update() {
        // Appelée par mainAnimationLoop
        // donc tous les 1/60 de seconde
        
        // Déplacement du joueur. 
        if (this.player != null) {
            this.movePlayer();
        }
        // on met à jouer la position de objetSouris avec la position de la souris
        // Pour un objet qui "suit" la souris mais avec un temps de retard, voir l'exemple
        // du projet "charQuiTire" dans le dossier COURS
        if (this.objetSouris != null) {
            this.objetSouris.x = this.inputStates.mouseX;
            this.objetSouris.y = this.inputStates.mouseY;
        }
       // On regarde si le joueur a atteint la sortie
        if (this.sortie!=null) {
            if (rectsOverlap(this.player.x-this.player.w/2, this.player.y - this.player.h/2, this.player.w, this.player.h, this.sortie.x, this.sortie.y, this.sortie.w, this.sortie.h)) {
                console.log("Niveau réussi");
                this.level++;
                this.initLevel();
            }
        }
    }

    movePlayer() {
        this.player.vitesseX = 0;
        this.player.vitesseY = 0;
        
        let right = this.inputStates.ArrowRight || this.inputStates.d
        let left = this.inputStates.ArrowLeft || this.inputStates.q
        let up = this.inputStates.ArrowUp || this.inputStates.z
        let down =  this.inputStates.ArrowDown || this.inputStates.s

        // Quand on se déplace en diagonale, on a une vitesse x et y qui est divisé par racine de 2

        if(right) {
            this.player.vitesseX = this.player.vit / (up || down ? Math.sqrt(2) : 1);
        } 
        if(left) {
            this.player.vitesseX = -this.player.vit / (up || down ? Math.sqrt(2) : 1);
        } 

        if(up) {
            this.player.vitesseY = -this.player.vit / (left || right ? Math.sqrt(2) : 1);
        } 

        if(down) {
            this.player.vitesseY = this.player.vit / (left || right ? Math.sqrt(2) : 1);
        } 

        this.player.move();

        this.testCollisionsPlayer();
    }

    testCollisionsPlayer() {
        // Teste collision avec les bords du canvas
        this.testCollisionPlayerBordsEcran();

        // Teste collision avec les obstacles
        this.testCollisionPlayer();
       
    }

    testCollisionPlayerBordsEcran() {
        // Raoppel : le x, y du joueur est en son centre, pas dans le coin en haut à gauche!
        if(this.player.x - this.player.w/2 < 0) {
            // On stoppe le joueur
            this.player.vitesseX = 0;
            // on le remet au point de contaxct
            this.player.x = this.player.w/2;
        }
        if(this.player.x + this.player.w/2 > this.canvas.width) {
            this.player.vitesseX = 0;
            // on le remet au point de contact
            this.player.x = this.canvas.width - this.player.w/2;
        }

        if(this.player.y - this.player.h/2 < 0) {
            this.player.y = this.player.h/2;
            this.player.vitesseY = 0;

        }
       
        if(this.player.y + this.player.h/2 > this.canvas.height) {
            this.player.vitesseY = 0;
            this.player.y = this.canvas.height - this.player.h/2;
        }
    }

    testCollisionPlayer() {
        this.objetsGraphiques.forEach(obj => {
            if(obj instanceof Obstacle) {
                if (rectsOverlap(this.player.x-this.player.w/2, this.player.y - this.player.h/2, this.player.w, this.player.h, obj.x, obj.y, obj.w, obj.h)) {
                    // collision

                    // ICI TEST BASIQUE QUI ARRETE LE JOUEUR EN CAS DE COLLIION.
                    // SI ON VOULAIT FAIRE MIEUX, ON POURRAIT PAR EXEMPLE REGARDER OU EST LE JOUEUR
                    // PAR RAPPORT A L'obstacle courant : il est à droite si son x est plus grand que le x de l'obstacle + la largeur de l'obstacle
                    // il est à gauche si son x + sa largeur est plus petit que le x de l'obstacle
                    // etc.
                    // Dans ce cas on pourrait savoir comment le joueur est entré en collision avec l'obstacle et réagir en conséquence
                    // par exemple en le repoussant dans la direction opposée à celle de l'obstacle...
                    // Là par défaut on le renvoie en x=100 y=100 et on l'arrête
                    this.initLevel();
                }
            }
        });
    }

    
    initLevel() {
        // Un objert qui suite la souris, juste pour tester
        // this.objetSouris = new ObjetSouris(200, 200, 25, 25, "orange");
        // this.objetsGraphiques.push(this.objetSouris);

        this.sortie = null;
        this.objetsGraphiques = [];
        this.player.init();
        this.objetsGraphiques.push(this.player);
        
        document.querySelector("#level").innerHTML = "Niveau : " + this.level;
        switch(this.level) {
            case 1:
                this.player.x = 20;
                this.player.y = 20;

                this.objetsGraphiques.push(new Obstacle(240, 0, 40, 160, "brown"));
                this.objetsGraphiques.push(new Obstacle(0, 360, 560, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(520, 200, 40, 160, "brown"));
                this.objetsGraphiques.push(new Obstacle(200, 560, 600, 40, "brown"));

                // On ajoute la sortie
                this.sortie = new Sortie(760, 760, 40, 40, "green");
                this.objetsGraphiques.push(this.sortie);
                break;
            case 2:
                this.player.x = 20;
                this.player.y = 20;

                this.objetsGraphiques.push(new Obstacle(80, 0, 40, 40, "brown"));

                this.objetsGraphiques.push(new Obstacle(680, 0, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(80, 40, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(160, 80, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(240, 120, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(320, 160, 160, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(600, 40, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(520, 80, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(440, 120, 120, 40, "brown"));
                
                
                this.objetsGraphiques.push(new Obstacle(0, 200, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(80, 240, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(160, 280, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(240, 320, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(320, 360, 160, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(600, 240, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(520, 280, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(440, 320, 120, 40, "brown"));


                this.objetsGraphiques.push(new Obstacle(680, 400, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(80, 440, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(160, 480, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(240, 520, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(320, 560, 160, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(600, 440, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(520, 480, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(440, 520, 120, 40, "brown"));

                
                this.objetsGraphiques.push(new Obstacle(0, 600, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(80, 640, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(160, 680, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(240, 720, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(320, 760, 160, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(600, 640, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(520, 680, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(440, 720, 120, 40, "brown"));
                

                // On ajoute la sortie
                this.sortie = new Sortie(760, 760, 40, 40, "green");
                this.objetsGraphiques.push(this.sortie);
                break;
            case 3:
                this.player.x = 20;
                this.player.y = 20;

                this.objetsGraphiques.push(new Obstacle(80, 0, 40, 100, "brown"));
                this.objetsGraphiques.push(new Obstacle(0, 180, 240, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(240, 100, 40, 200, "brown"));

                this.objetsGraphiques.push(new Obstacle(400, 0, 40, 360, "brown"));
                this.objetsGraphiques.push(new Obstacle(400, 400, 40, 320, "brown"));

                this.objetsGraphiques.push(new Obstacle(160, 400, 240, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(160, 400, 40, 240, "brown"));
                this.objetsGraphiques.push(new Obstacle(280, 400, 40, 240, "brown"));
                
                this.objetsGraphiques.push(new Obstacle(40, 320, 40, 440, "brown"));
                this.objetsGraphiques.push(new Obstacle(80, 720, 200, 40, "brown"));
                
                this.objetsGraphiques.push(new Obstacle(440, 400, 240, 40, "brown"));

                this.objetsGraphiques.push(new Obstacle(520, 520, 160, 160, "brown"));
                
                this.objetsGraphiques.push(new Obstacle(720, 560, 40, 160, "brown"));
                this.objetsGraphiques.push(new Obstacle(560, 720, 200, 40, "brown"));

                this.objetsGraphiques.push(new Obstacle(440, 320, 80, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(560, 320, 40, 80, "brown"));

                this.objetsGraphiques.push(new Obstacle(520, 40, 200, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(720, 40, 40, 200, "brown"));
                this.objetsGraphiques.push(new Obstacle(600, 200, 120, 40, "brown"));
                this.objetsGraphiques.push(new Obstacle(560, 200, 40, 120, "brown"));

                // On ajoute la sortie
                this.sortie = new Sortie(640, 120, 40, 40, "green");
                this.objetsGraphiques.push(this.sortie);
                break;
            default:
                alert("Bravo, vous avez fini le jeu !");
                this.init();
                break;
        }
    }

}