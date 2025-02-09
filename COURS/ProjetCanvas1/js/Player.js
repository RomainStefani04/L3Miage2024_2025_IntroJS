import ObjectGraphique from "./ObjectGraphique.js";
import { drawCircleImmediat } from "./utils.js";   

export default class Player extends ObjectGraphique {
    constructor(x, y) {
        super(x, y, 30, 30);
        this.vitesseX = 0;
        this.vitesseY = 0;
        this.angle = 0;
        this.vit = 2;
    }

    init() {
        this.h = 30;
        this.w = 30;
        this.vitesseX = 0;
        this.vitesseY = 0;
        this.angle = 0;
        this.vit = 2;
    }

    draw(ctx) {
        // Ici on dessine un monstre
        ctx.save();

        // on déplace le systeme de coordonnées pour placer
        // le monstre en x, y.Tous les ordres de dessin
        // dans cette fonction seront par rapport à ce repère
        // translaté
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        // on recentre le monstre. Par défaut le centre de rotation est dans le coin en haut à gauche
        // du rectangle, on décale de la demi largeur et de la demi hauteur pour 
        // que le centre de rotation soit au centre du rectangle.
        // Les coordonnées x, y du monstre sont donc au centre du rectangle....
        ctx.translate(-this.w / 2, -this.h / 2);
        //this.ctx.scale(0.5, 0.5);

        // Hitbox du personnage pour debug
        // ctx.strokeStyle = "black";
        // ctx.lineWidth = 1;
        // ctx.strokeRect(0, 0, this.w, this.h);

        let multHeight = this.h/100;

        // Dessin du monstre
        ctx.fillStyle = "#cb957b";
        ctx.fillRect(this.w/2 - 42.5*multHeight, this.h/2 - 25*multHeight, 85*multHeight, 70*multHeight);

        // pieds
        ctx.fillStyle = "#753c13";
        ctx.fillRect(0, this.h - 20*multHeight, 35*multHeight, 20*multHeight);

        ctx.fillStyle = "#753c13";
        ctx.fillRect(this.w - 35*multHeight, this.h - 20*multHeight, 35*multHeight, 20*multHeight);

        // yeux
        ctx.fillStyle = "white";
        ctx.fillRect(this.w/2 - 25*multHeight, this.h/2 - 5*multHeight, 20*multHeight, 10*multHeight);

        ctx.fillStyle = "#6fa4f3";
        ctx.fillRect(this.w/2 - 19*multHeight, this.h/2 - 2*multHeight, 10*multHeight, 5*multHeight);

        ctx.fillStyle = "white";
        ctx.fillRect(this.w/2 + 5*multHeight, this.h/2 - 5*multHeight, 20*multHeight, 10*multHeight);

        ctx.fillStyle = "#6fa4f3";
        ctx.fillRect(this.w/2 + 11*multHeight, this.h/2 - 2*multHeight, 10*multHeight, 5*multHeight);

        // bouche
        ctx.fillStyle = "black";
        ctx.fillRect(this.w/2 - 8*multHeight, this.h/2 + 19*multHeight, 20*multHeight, 4*multHeight);

        // chapeau
        ctx.fillStyle = "#89837c";
        ctx.fillRect(0, 0, 100*multHeight, 40*multHeight);

        // restore
        ctx.restore();

        // super.draw() dessine une croix à la position x, y
        // pour debug
        // super.draw(ctx);
    }

    move() {
        this.x += this.vitesseX;
        this.y += this.vitesseY;
    }
}