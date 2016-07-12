var Main = pc.createScript('main');

Main.attributes.add('tankA', {
    type: 'entity',
    default: null
});

Main.attributes.add('tankB', {
    type: 'entity',
    default: null
});


Main.attributes.add('camera', {
    type: 'entity',
    default: null
});


Main.STATUS_MENU = 'menu';
Main.STATUS_INGAME = 'ingame';
Main.STATUS_PAUSE = 'pause';

Main.ACTOR_P1 = 'P1';
Main.ACTOR_P2 = 'P2';

Main.PC_ACTING = false;

Main.MIN_POWER = 1.5;
Main.MAX_POWER = 4;

Main.POWER_SPEED = 1;
Main.ANGULAR_SPEED = 20;

Main.MOVE_SPEED = 0.3;
Main.BOUNDING_RADIUS = 1;

Main.NUM_LIFE = 3;
//Camera
//before after flying

Main.actorMap = {'P1': 0, 'P2': 1};

// initialize code called once per entity
Main.prototype.initialize = function() {
    this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
    this.app.keyboard.on(pc.EVENT_KEYUP, this.onKeyUp, this);

    this._status = Main.STATUS_MENU;


    //
    this._findCamera();
    this._findExplosion();

};

// update code called every frame
Main.prototype.update = function(dt) {

    this._updateCamera();
    this._updateInput(dt);

};

Main.prototype._updateInput = function(dt) {

    if (this._status !== Main.STATUS_INGAME) {
        return;
    }

    if (this._cameraStatus !== 'ready') {
        return;
    }

    if (this.app.keyboard.isPressed(pc.KEY_SPACE)) {
        this.updatePower(Main.POWER_SPEED * dt);
        return;
    }

    if (this._actor === Main.ACTOR_P1) {
        if (this.app.keyboard.isPressed(pc.KEY_W)) {
            this.updateAngle(Main.ANGULAR_SPEED * dt);
        }
        if (this.app.keyboard.isPressed(pc.KEY_S)) {
            this.updateAngle(Main.ANGULAR_SPEED * dt * -1);
        }
        if (this.app.keyboard.isPressed(pc.KEY_D)) {
            this.updatePosition(Main.MOVE_SPEED * dt);
        }
        if (this.app.keyboard.isPressed(pc.KEY_A)) {
            this.updatePosition(Main.MOVE_SPEED * dt * - 1);
        }
    }

    if (this._actor === Main.ACTOR_P2) {
        if (this.app.keyboard.isPressed(pc.KEY_UP)) {
            this.updateAngle(Main.ANGULAR_SPEED * dt);
        }
        if (this.app.keyboard.isPressed(pc.KEY_DOWN)) {
            this.updateAngle(Main.ANGULAR_SPEED * dt * -1);
        }
        if (this.app.keyboard.isPressed(pc.KEY_RIGHT)) {
            this.updatePosition(Main.MOVE_SPEED * dt);
        }
        if (this.app.keyboard.isPressed(pc.KEY_LEFT)) {
            this.updatePosition(Main.MOVE_SPEED * dt * - 1);
        }
    }
};

// swap method called for script hot-reloading
// inherit your script state here
Main.prototype.swap = function(old) {

};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/
Main.prototype.onKeyDown = function(event) {
    var code = event.event.code;

    if (this._status !== Main.STATUS_INGAME) {
        return;
    }

    if (this._cameraStatus !== 'ready') {
        return;
    }

    var index = Main.actorMap[this._actor];

    if (code === 'Space') {
        if (this._tanks[index].onSpace === false) {
             this._tanks[index].power = Main.MIN_POWER;
             this._tanks[index].onSpace = true;
             this._tanks[index].powerBar.enabled = true;
        }
    }
};

Main.prototype.onKeyUp = function(event) {
//     console.log(event.event.code);
    var index = Main.actorMap[this._actor];
    var code = event.event.code;
    if (code === 'Space') {
        if (this._status !== Main.STATUS_INGAME) {
            this._status = Main.STATUS_INGAME;
            this._gameInitialize();
            return;
        }
        if (this._tanks[index].onSpace) {
            this._tanks[index].onSpace = false;
            this._tanks[index].powerBar.enabled = false;
            this.shoot();
        }
    }
};


Main.prototype.shoot = function() {
    console.log('shoot');
    var index = Main.actorMap[this._actor];

    var entity = this._tanks[index].bullet.clone();
    var worldPosition = this._tanks[index].bullet.getPosition();
    entity.enabled = true;
    var power = this._tanks[index].power;
//     var power = 3;
    var yAngles = this._tanks[index].yAngles;
    entity.setPosition(worldPosition);
    if (index === 1) {
        yAngles = 180 - yAngles;
    }

    var pZ = power * Math.cos(Math.PI * yAngles / 180);
    var pY = power * Math.sin(Math.PI * yAngles / 180);
    console.log('Power ' + power);
    entity.rigidbody.applyImpulse(0, pY, pZ);

    entity.collision.on('collisionstart', this.onCollision, this);

    this.app.root.addChild(entity);
    entity.setName(this._actor);

    this._cameraStatus = 'flying';
    this._entity = entity;
};


Main.prototype.onCollision = function(result) {
//     var myself = this._entity.getName();
    var pos = this._entity.getPosition();
    console.log(pos);
    this._explosion.setLocalPosition(pos.x, pos.y, pos.z);

    this._cameraStatus = 'exploding';
    this._entity.destroy();

    this._explosion.particlesystem.reset();
    this._explosion.particlesystem.play();

    var other = result.other.name;
    if (other === 'TankA') {
        this.updateLife(0);
    }
    if (other === 'TankB') {
        this.updateLife(1);
    }


    if (this._actor === Main.ACTOR_P1) {
         this._actor = Main.ACTOR_P2;
    } else {
        this._actor = Main.ACTOR_P1;
    }

    (function(scope){
        setTimeout(function(){
            scope._cameraStatus = 'before';
        }, 2000);
    })(this);

};



//Update Series
//Update parameters with event
Main.prototype.updateAngle = function(arg) {

    var index = Main.actorMap[this._actor];
//     console.log('Index ' + index + ' Euler ' + this._tanks[index].yAngles);
    this._tanks[index].yAngles += arg;
    if (index === 0) {
         this._tanks[index].gun.setEulerAngles(-1 * this._tanks[index].yAngles, 0, 0);
    } else {
        this._tanks[index].gun.setEulerAngles(-1 * this._tanks[index].yAngles, 180, 0);
    }
};

Main.prototype.updatePower = function(arg) {
    var index = Main.actorMap[this._actor];
    this._tanks[index].power += arg;
    if (this._tanks[index].power >= Main.MAX_POWER) {
        this._tanks[index].power -= (Main.MAX_POWER - Main.MIN_POWER);
    }

    var percent = (this._tanks[index].power - Main.MIN_POWER) / (Main.MAX_POWER - Main.MIN_POWER);
    this._tanks[index].powerBar.outer.setLocalScale(0.06, percent, 0.06);
    this._tanks[index].powerBar.outer.setLocalPosition(0, (percent - 1) / 2, 0);
};


Main.prototype.updatePosition = function (args) {
    console.log(args);
    var index = Main.actorMap[this._actor];

    var p = this._tanks[index].getPosition();
    var pos = p.z;
    var y = p.y;
    pos += args;
    if(pos > this._tanks[index].initPos + Main.BOUNDING_RADIUS) {
        pos = this._tanks[index].initPos + Main.BOUNDING_RADIUS;
    }
    if(pos < this._tanks[index].initPos - Main.BOUNDING_RADIUS) {
        pos = this._tanks[index].initPos - Main.BOUNDING_RADIUS;
    }
    this._tanks[index].setPosition(0, y, pos);
}

Main.prototype.updateLife = function(i) {
    this._tanks[i].life -= 1;
    if (this._tanks[i].life <= 0) {
        this._gameEnd(i);
    } else {
        this._tanks[i].hearts[this._tanks[i].life].enabled = false;
    }
};

Main.prototype._gameEnd = function(winner){
    document.getElementById('winner-name').innerText = {
        0: 'Alice',
        1: 'Bob',
    }[winner];
    document.getElementById('game-over').style.opacity = 1;
}


Main.prototype._gameInitialize = function() {

    document.getElementById('game-start').style.display = 'none';

    this._tanks = [this.app.root.findByName('TankA'),
                   this.app.root.findByName('TankB')];

    for (var i = 0; i < 2; ++i) {
        console.log('I ' + i);
        this._tanks[i].yAngles = 0;
        this._tanks[i].gun = this._tanks[i].findByName('Gun');
        this._tanks[i].bullet = this._tanks[i].gun.findByName('bullet');
        this._tanks[i].preHeart = this._tanks[i].findByName('preHeart');
        this._tanks[i].power = 0;
        this._tanks[i].powerBar = this._tanks[i].findByName('PowerBar');
        this._tanks[i].powerBar.outer = this._tanks[i].powerBar.findByName('outer');
        this._tanks[i].onSpace = false;
        this._tanks[i].initPos = this._tanks[i].getPosition().z;
        this._tanks[i].hearts = [];
        this._tanks[i].life = Main.NUM_LIFE;

        for (var j = 0; j < Main.NUM_LIFE; ++j) {
            var heart = this._tanks[i].preHeart.clone();
            heart.enabled = true;
            this._tanks[i].addChild(heart);
            heart.setLocalPosition(0, 1.2, -0.5 + 0.5 * j);
            this._tanks[i].hearts.push(heart);
        }
    }

    this._actor = Main.ACTOR_P1;
    this._cameraStatus = 'before';
};



Main.prototype._updateCamera = function(dt){


    //console.log(this._cameraBeforeTimer);
    //console.log(this._cameraStatus);
    function halfWay(a, b, t){
        //t \in [0, 1]
        //return \in [a, b]

        var d;
        if(t < .5)
            d = 2*t*t;
        else
            d = -2*(t-1)*(t-1) + 1;

        t = d;
        return a+(b-a)*t;
    }




    switch(this._cameraStatus){
        case 'exploding':
            break;
        case 'before':

            if(typeof this._cameraBeforeTimer === 'undefined'){
                this._cameraBeforeTimer = 0;
            }


            var myself = this._tanks[Main.actorMap[this._actor]].getPosition();
            var target = this._tanks[[1, 0][Main.actorMap[this._actor]]].getPosition();
            var angleFlag = (this._actor==='P1'? 1: -1);
            /*

             look at myself
             -10, 1, myself.x, 0, -90, 0

             look at target
             -10, 1, myself.x * 2, 0, -90 +- 50, 0

             */
            this._cameraBeforeTimer += .5;
            t = this._cameraBeforeTimer;

            if(t > 100){
                this._cameraBeforeTimer = 0;
                this._cameraStatus = 'ready';

            }else if(t < 20){
                //look at A
                this._camera.setPosition(-2, .2, myself.z);
                this._camera.setLocalEulerAngles(0, -90, 0);

            }else if(t < 40){
                //A -> B
                var a = (t-20) / 20;
                this._camera.setPosition(halfWay(-2, -10, a), halfWay(.2, 1, a), myself.z * halfWay(1, 2, a));
                this._camera.setLocalEulerAngles(0, -90 - 50*halfWay(0, angleFlag, a), 0);

            }else if(t < 60){
                //look at B

                //slow down timing
                this._cameraBeforeTimer -= .2;
                t = this._cameraBeforeTimer;

                this._camera.setPosition(-10, 1, myself.z * 2);
                this._camera.setLocalEulerAngles(0, -90 - 50*angleFlag, 0);

            }else if(t < 80){
                //B -> A
                var a = (t-60) / 20;
                this._camera.setPosition(halfWay(-10, -2, a), halfWay(1, .2, a), myself.z * halfWay(2, 1, a));
                this._camera.setLocalEulerAngles(0, -90 - 50*halfWay(angleFlag, 0, a), 0);

            }else{
                //look at A
                this._camera.setPosition(-2, .2, myself.z);
                this._camera.setLocalEulerAngles(0, -90, 0);
            }
            break;
        case 'flying':
            //follow bullet
            var p = this._entity.getPosition();
            var v = this._entity.rigidbody.linearVelocity.normalize();

            function f(x, y, k){
                if(!k)
                    k=3;
                return x - k*y;
            }

            //position of camera
            var px = f(p.x, v.x);
            var py = f(p.y, v.y);
            var pz = f(p.z, v.z);
            if(py < .1){
                var k = (-.1 + p.y) / v.y;
                px = f(p.x, v.x, k);
                py = f(p.y, v.y, k);
                pz = f(p.z, v.z, k);

            }
            this._camera.setPosition(px, py, pz);

            var ex = Math.atan(v.y/ v.z) / Math.PI * 180 * (v.z>0? 1: -1);
            var ey = (v.z<0? 0: 180);
            this._camera.setEulerAngles(ex, ey, 0);

            break;
        case 'ready':
            var myself = this._tanks[Main.actorMap[this._actor]].getPosition();
            this._camera.setPosition(-2, .2, myself.z);
            this._camera.setLocalEulerAngles(0, -90, 0);
            break;
    }

};


Main.prototype._findCamera = function(){
    this._camera = this.app.root.findByName('Camera');

}

Main.prototype._findExplosion = function(){
    this._explosion = this.app.root.findByName('Explosion');
}


Main.prototype._followBombTest = function(){
    console.log('flying')
    console.log({x:px, y:py, z:pz})
    console.log({x:p.x, y:p.y, z:p.z})
    console.log({x:v.x, y:v.y, z:v.z})
    var myself = this._tanks[Main.actorMap[this._actor]].getPosition();
    var target = this._tanks[[1, 0][Main.actorMap[this._actor]]].getPosition();
    var angleFlag = (this._actor==='P1'? 1: -1);
    //this._camera.setPosition(-10, 1, myself.z * 2);
    this._camera.setLocalEulerAngles(0, -90 - 50*angleFlag, 0);
};
