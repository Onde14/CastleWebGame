

import GameConfig from './GameConfig.json' with { type: 'json' };

export enum GameSize {
  width = GameConfig.width,
  height = GameConfig.height,
}

export enum CastleConfig {
  width = GameConfig.castleSize,
  height = GameConfig.castleSize,
  color = "gray",
  ownerColorWidth = CastleConfig.width / 2,
  ownerColorHeight = CastleConfig.height / 2,
}

export enum SoldierConfig {
  width = GameConfig.soldierRadius,
  height = GameConfig.soldierRadius,
  color = "black",
  radius = GameConfig.soldierRadius,
  ownerColorRadius = SoldierConfig.radius / 2
}

export enum RoadConfig {
  width = 10,
}

export enum VillageSize {
  width = GameConfig.villageSize,
  height = GameConfig.villageSize
}