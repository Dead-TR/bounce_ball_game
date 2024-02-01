import { PhysicTypeObject } from "containers/App/createEmitter";
import DefaultScene from "../Default";
import { between } from "utils/between";

const circleWidth = 50;

export class Physic {
  constructor(scene: DefaultScene) {
    this.scene = scene;

    this.prepare();
    this.createClickListener();
  }
  private scene: DefaultScene;
  private type: PhysicTypeObject = "circle";
  private bodies?: Phaser.Physics.Arcade.Group;

  private prepare = () => {
    const circle = this.scene.add
      .graphics()
      .fillStyle(0xffff00)
      .fillCircle(circleWidth / 2, circleWidth / 2, circleWidth / 2);
    circle.generateTexture("circleSprite", circleWidth, circleWidth);
    circle.destroy(true);

    this.bodies = this.scene.physics.add.group({
      bounceX: 0.5,
      bounceY: 0.5,
      collideWorldBounds: true,
      dragX: 0.25,
      dragY: 0.25
    })


    // this.bodies = this.scene.physics.add.group({
    //   active: true,
    //   maxSize: -1,
    //   bounceX: 1, // Коефіцієнт відскоку по горизонталі (змініть за потребою)
    //   bounceY: 1, // Коефіцієнт відскоку по вертикалі (змініть за потребою)
    //   collideWorldBounds: true, // Взаємодія з межами світу
    //   dragX: 1, // Значення тертя по горизонталі
    //   dragY: 1, // Значення тертя по вертикалі
    //   frictionX: 1, // Значення тертя по горизонталі (аналогічно dragX)
    //   frictionY: 1, // Значення тертя по вертикалі (аналогічно dragY)
    //   gravityY: 500, // Гравітація по вертикалі (змініть за потребою)
    //   immovable: false, // Чи тіло може бути рухомим
    //   mass: 1000, // Маса тіла (впливає на реакцію на гравітацію та взаємодію з іншими тілами)
    //   accelerationX: 100,
    //   accelerationY: 100,
    //   // collideCallback: null, // Функція зіткнення, яка викликається при зіткненні
    //   // overlapCallback: null, // Функція перекриття, яка викликається при перекритті
    //   allowGravity: true, // Включити/відключити гравітацію для цього об'єкта
    //   // staticGroup: false, // Чи ця група є статичною (виключити рух та колізії)
    //   // collideWorldBounds: false, // Взаємодія з межами світу
    //   velocityX: 0, // Початкова швидкість по горизонталі
    //   velocityY: 100, // Початкова швидкість по вертикалі
    //   angularVelocity: 100, // Початкова кутова швидкість
    //   angularAcceleration: 0.8, // Прискорення обертання
    //   angularDrag: 1, // Тертя обертання
    //   // rotation: 0, // Початковий кут обертання
    //   // collideCallback: null, // Функція зіткнення
    //   // allowDragEvent: true, // Включити події Drag (перетягування)
    //   // allowRotationEvent: true, // Включити події Rotation (обертання)
    //   maxVelocityX: 10000, // Максимальна швидкість по горизонталі
    //   maxVelocityY: 10000, // Максимальна швидкість по вертикалі
    //   // angularDrag: 0, // Тертя при обертанні
    //   // drag: 0, // Загальне значення тертя
    //   // name: "", // Ім'я групи
    //   // active: true, // Активна група чи ні
    //   // maxSize: -1, // Максимальна кількість об'єктів в групі
    //   // hitArea: null, // Зона удару для об'єкта (необов'язково)
    //   // hitAreaCallback: null, // Функція визначення зони удару (необов'язково)
    //   // hitAreaCallbackScope: null, // Зона удару функції зона впливу (необов'язково)
    //   // hitAreaShapes: null, // Форми зони удару (необов'язково)
    //   // hitAreaCallback: null, // Функція зони удару (необов'язково)
    //   // hitAreaCallbackScope: null, // Зона удару функції зона впливу (необов'язково)
    //   // createCallback: null, // Функція, яка викликається при створенні нового об'єкта в групі (необов'язково)
    //   // removeCallback: null, // Функція, яка викликається при видаленні об'єкта з групи (необов'язково)
    //   // createMultipleCallback: null, // Функція, яка викликається при створенні кількох об'єктів (необов'язково)
    //   // classType: null, // Тип класу, який використовується для створення об'єктів (необов'язково)
    //   runChildUpdate: false, // Визначає, чи викликати update для дочірніх об'єктів при оновленні групи (необов'язково)
    //   // createFromConfig: null, // Функція, яка викликається при створенні об'єкта з конфігурації (необов'язково)
    //   // setAlphaCallback: null, // Функція, яка викликається при встановленні альфа-каналу (необов'язково)
    //   // setAlphaCallbackScope: null, // Область визначення функції встановлення альфа-каналу (необов'язково)
    //   // createCallback: null, // Функція, яка викликається при створенні нового об'єкта в групі (необов'язково)
    //   // classType: null, // Тип класу, який використовується для створення об'єктів (необов'язково)
    // });
    //@ts-ignore
    this.scene.physics.add.collider(this.bodies);
    if (this.scene.player?.playerBody)
      this.scene.physics.add.collider(
        this.bodies,
        this.scene.player.playerBody,
      );

    if (this.scene.world)
      this.scene.physics.add.collider(this.bodies, this.scene.world);
  };

  private createClickListener = () => {
    this.scene.input.on("pointerdown", (event: any) => {
      const point = this.scene.cameras.cameras[0].getWorldPoint(
        event.x,
        event.y,
      );

      this.createCircle(point.x, point.y);
    });
  };

  private createCircle = (x: number, y: number) => {
    if (this.scene.world && this.scene.player?.playerBody) {
      this.bodies
        ?.create(x, y, "circleSprite")
        .setCircle(circleWidth / 2)
        // .setBounce(between(-1, 1), 0.5)
        .setDamping(true);
      // .setMass(1000)
      // .setFriction(10);
      // this.scene.physics.add.collider(sprite, this.scene.player.playerBody)

      // this.bodies.forEach((body) =>
      //   this.scene.physics.add.collider(sprite, body),
      // );

      // this.bodies.push(sprite);
    }
  };
}
