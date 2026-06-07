import GameConfig from './GameConfig.json' with { type: 'json' };
export var GameSize;
(function (GameSize) {
    GameSize[GameSize["width"] = GameConfig.width] = "width";
    GameSize[GameSize["height"] = GameConfig.height] = "height";
})(GameSize || (GameSize = {}));
export var CastleConfig;
(function (CastleConfig) {
    CastleConfig[CastleConfig["width"] = GameConfig.castleSize] = "width";
    CastleConfig[CastleConfig["height"] = GameConfig.castleSize] = "height";
    CastleConfig["color"] = "gray";
    CastleConfig[CastleConfig["ownerColorWidth"] = CastleConfig.width / 2] = "ownerColorWidth";
    CastleConfig[CastleConfig["ownerColorHeight"] = CastleConfig.height / 2] = "ownerColorHeight";
})(CastleConfig || (CastleConfig = {}));
export var SoldierConfig;
(function (SoldierConfig) {
    SoldierConfig[SoldierConfig["width"] = GameConfig.soldierRadius] = "width";
    SoldierConfig[SoldierConfig["height"] = GameConfig.soldierRadius] = "height";
    SoldierConfig["color"] = "black";
    SoldierConfig[SoldierConfig["radius"] = GameConfig.soldierRadius] = "radius";
    SoldierConfig[SoldierConfig["ownerColorRadius"] = SoldierConfig.radius / 2] = "ownerColorRadius";
})(SoldierConfig || (SoldierConfig = {}));
export var RoadConfig;
(function (RoadConfig) {
    RoadConfig[RoadConfig["width"] = 10] = "width";
})(RoadConfig || (RoadConfig = {}));
export var VillageSize;
(function (VillageSize) {
    VillageSize[VillageSize["width"] = GameConfig.villageSize] = "width";
    VillageSize[VillageSize["height"] = GameConfig.villageSize] = "height";
})(VillageSize || (VillageSize = {}));
//# sourceMappingURL=config.js.map