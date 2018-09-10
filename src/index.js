import phaser from 'phaser'

import GameScene from './game_scene'

window.game = new phaser.Game({
  type: phaser.AUTO,
  parent: 'game',
  width: 900,
  height: 600,
  backgroundColor: 0xdddddd,
  scene: [
    GameScene,
  ],
})
