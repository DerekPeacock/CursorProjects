import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface GameScene extends Phaser.Scene {
  player: Phaser.Physics.Arcade.Sprite;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
}

class GameScene extends Phaser.Scene {
  player!: Phaser.Physics.Arcade.Sprite;
  platforms!: Phaser.Physics.Arcade.StaticGroup;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Create simple colored rectangles for the game objects
    this.load.image('player', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('platform', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create() {
    // Create platforms
    this.platforms = this.physics.add.staticGroup();
    
    // Ground platform
    this.platforms.create(400, 580, 'platform').setScale(800, 40).refreshBody();
    
    // Floating platforms
    this.platforms.create(600, 400, 'platform').setScale(200, 20).refreshBody();
    this.platforms.create(50, 250, 'platform').setScale(200, 20).refreshBody();
    this.platforms.create(750, 220, 'platform').setScale(200, 20).refreshBody();
    this.platforms.create(400, 350, 'platform').setScale(200, 20).refreshBody();

    // Create player
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setScale(32, 32);
    this.player.setTint(0x00ff00); // Green color

    // Set player physics properties
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Add collision between player and platforms
    this.physics.add.collider(this.player, this.platforms);

    // Setup camera to follow player
    this.cameras.main.setBounds(0, 0, 800, 600);
    this.cameras.main.startFollow(this.player);

    // Setup input
    const keyboard = this.input.keyboard;
    if (keyboard) {
      this.cursors = keyboard.createCursorKeys();
    }
  }

  update() {
    if (!this.player || !this.cursors) return;

    // Player movement
    if (this.cursors?.left?.isDown) {
      this.player.setVelocityX(-160);
      this.player.setTint(0xff0000); // Red when moving left
    } else if (this.cursors?.right?.isDown) {
      this.player.setVelocityX(160);
      this.player.setTint(0x0000ff); // Blue when moving right
    } else {
      this.player.setVelocityX(0);
      this.player.setTint(0x00ff00); // Green when idle
    }

    // Player jump
    if (this.cursors?.up?.isDown && this.player.body?.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}

const PhaserGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: containerRef.current,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 300 },
            debug: false
          }
        },
        scene: GameScene,
        backgroundColor: '#87CEEB' // Sky blue background
      };

      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Platformer Game</h1>
        <p className="text-gray-300 text-lg">
          Use arrow keys to move and jump!
        </p>
        <div className="mt-4 text-sm text-gray-400">
          <p>← → Move left/right</p>
          <p>↑ Jump</p>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        className="border-4 border-white rounded-lg shadow-2xl"
        style={{ width: '800px', height: '600px' }}
      />
      
      <div className="mt-6 text-center text-gray-300">
        <p>Built with Phaser 3 + React + TypeScript</p>
      </div>
    </div>
  );
};

export default PhaserGame;
