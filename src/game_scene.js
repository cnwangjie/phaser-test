import { Scene, Math } from 'phaser'

class GameScene extends Scene {

  constructor() {
    super({
      key: 'GameScene',
      physics: {
        system: 'arcade',
        arcade: {
          debug: false,
        }
      }
    })
  }

  drawRect() {
    const rect = this.make.graphics()
    rect.fillStyle(0x3333ff)
    rect.fillCircle(3, 3, 3)
    rect.generateTexture('rect', 6, 6)
    rect.destroy()
  }

  drawPointer() {
    const pointer = this.make.graphics()
    pointer.fillStyle(0xaaaa33)
    pointer.fillCircle(6, 6, 6)
    pointer.generateTexture('pointer', 12, 12)
    pointer.destroy()
  }

  gameOverText() {
    if (!this._gameOverText) {
      this._gameOverText = this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'game over\npress R to restart', { fontSize: '68px', fill: '#000000' })
      this._gameOverText.setAlign('center')
      this._gameOverText.x -= this._gameOverText.width / 2
      this._gameOverText.y -= this._gameOverText.height / 2
    }
    return this._gameOverText
  }

  get pos() {
    return this.game.input.mousePointer.position
  }

  _generateNewRectPos() {
    const pos = new Math.Vector2(
      Math.RND.integerInRange(0, this.game.config.width),
      Math.RND.integerInRange(0, this.game.config.height)
    )
    if (pos.distance(this.pointer.getCenter()) > 20) return pos
    return this._generateNewRectPos()
  }

  create() {
    this.ended = true
    this._best = 0
    this.R = this.input.keyboard.addKey('R')
    this.rects = this.add.group()
    this.drawRect()
    this.drawPointer()
    this.count = this.add.text(10, 10, 'press R to start', { fontSize: '32px', fill: '#ff0000' })
    this.pointer = this.add.sprite(0, 0, 'pointer')
    this.pointer.visible = false

    this.rectGenerator = this.time.addEvent({delay: 60, loop: true, callback: () => {
      const pos = this._generateNewRectPos()
      const rect = this.physics.add.sprite(pos.x, pos.y, 'rect')
      this.physics.accelerateTo(rect, this.pos.x, this.pos.y)
      rect.body.onWorldBounds = true
      this.rects.add(rect)
    }})
    this.rectGenerator.paused = true
  }

  _update() {
    this.pointer.setPosition(this.pos.x, this.pos.y)
    this.rects.children.each(rect => {
      if (rect.body.checkWorldBounds()) {
        this.rects.remove(rect, true, true)
      } else if (rect.body.position.distance(this.pointer.getCenter()) < 9) {
        this.end()
      }
    })
    this.count.setText('count: ' + this.rects.getLength() +
      ' time: ' + ((this.game.loop.time - this.startTime) / 1000).toFixed(2) +
      ' best: ' + this._best)
  }

  _start() {
    this.startTime = this.game.loop.time
    this.rects.clear(true, true)
    this.ended = false
    this.pointer.visible = true
    this.rectGenerator.paused = false
    this.gameOverText().visible = false
  }

  update() {
    if (this.ended) {
      if (this.R.isDown) {
        this._start()
      }
    } else {
      this._update()
    }
  }

  end() {
    this.gameOverText().visible = true
    this.ended = true
    this.rectGenerator.paused = true
    if ((this.game.loop.time - this.startTime) / 1000 > +this._best) {
      this._best = ((this.game.loop.time - this.startTime) / 1000).toFixed(2)
    }
    this.rects.children.each(rect => {
      rect.body.stop()
    })
  }

}

export default GameScene
